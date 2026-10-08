import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { SIZE_ORDER } from "../../lib/products";
import { currencySymbol } from "../../lib/currency";
import {
  ALLOWED_TYPES,
  uploadProductImage,
  removeImages,
} from "../../lib/images";
import { shopFilters } from "../../data/categories";
import "./admin.css";
import "./ProductForm.css";

const CATEGORIES = shopFilters.filter((f) => f.id !== "all");
const TAGS = ["", "New", "Low stock", "Sale"];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyStock = () => Object.fromEntries(SIZE_ORDER.map((s) => [s, 0]));

function toForm(p) {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    description: p?.description ?? "",
    price: p ? (p.price_cents / 100).toFixed(2) : "",
    category: p?.category ?? CATEGORIES[0].id,
    tag: p?.tag ?? "",
    stock: { ...emptyStock(), ...(p?.stock ?? {}) },
    images: p?.images ?? [],
    published: p?.published ?? false,
  };
}

export default function ProductForm({ product }) {
  const navigate = useNavigate();
  const isNew = !product;

  const [form, setForm] = useState(() => toForm(product));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addedRef = useRef([]); // uploaded during this edit session
  const [removed, setRemoved] = useState([]); // original photos taken off

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onName = (value) =>
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));

  const setStock = (size, value) =>
    setForm((f) => ({
      ...f,
      stock: { ...f.stock, [size]: value === "" ? "" : Number(value) },
    }));

  /* ---------- photos ---------- */
  const onFiles = async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`${file.name}: use a JPG, PNG or WebP image.`);
        }
        const url = await uploadProductImage(file);
        addedRef.current.push(url);
        setForm((f) => ({ ...f, images: [...f.images, url] }));
      }
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (from, to) =>
    setForm((f) => {
      if (to < 0 || to >= f.images.length) return f;
      const next = [...f.images];
      [next[from], next[to]] = [next[to], next[from]];
      return { ...f, images: next };
    });

  const removeImage = async (url) => {
    set(
      "images",
      form.images.filter((u) => u !== url)
    );
    if (addedRef.current.includes(url)) {
      addedRef.current = addedRef.current.filter((u) => u !== url);
      await removeImages([url]);
    } else {
      setRemoved((r) => [...r, url]);
    }
  };

  /* ---------- save / delete / cancel ---------- */
  const validate = () => {
    if (!form.name.trim()) return "Give the product a name.";
    if (!SLUG_RE.test(form.slug))
      return "Slug can only use lowercase letters, numbers and hyphens.";
    const price = Number(form.price);
    if (form.price === "" || Number.isNaN(price) || price < 0)
      return "Enter a valid price.";
    for (const s of SIZE_ORDER) {
      const n = form.stock[s];
      if (n === "" || !Number.isInteger(n) || n < 0)
        return `Stock for ${s} must be a whole number, 0 or more.`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      slug: form.slug,
      description: form.description.trim(),
      price_cents: Math.round(Number(form.price) * 100),
      category: form.category,
      tag: form.tag || null,
      images: form.images,
      stock: form.stock,
      published: form.published,
    };

    const { error: err } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", product.id);

    if (err) {
      setError(
        err.code === "23505"
          ? "That slug is already used by another product."
          : err.message
      );
      setSaving(false);
      return;
    }

    await removeImages(removed);
    navigate("/admin/products");
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`))
      return;

    setSaving(true);
    const { error: err } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    await removeImages(product.images ?? []);
    navigate("/admin/products");
  };

  const handleCancel = async () => {
    await removeImages(addedRef.current); // throw away unsaved uploads
    navigate("/admin/products");
  };

  const busy = saving || uploading;

  return (
    <form className="pform" onSubmit={handleSubmit} noValidate>
      <div className="pform__col">
        <div className="field">
          <label className="mono" htmlFor="p-name">
            Name
          </label>
          <input
            id="p-name"
            value={form.name}
            onChange={(e) => onName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="mono" htmlFor="p-slug">
            Slug (the page address)
          </label>
          <input
            id="p-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
          />
        </div>

        <div className="field">
          <label className="mono" htmlFor="p-desc">
            Description
          </label>
          <textarea
            id="p-desc"
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="pform__row">
          <div className="field">
            <label className="mono" htmlFor="p-price">
             Price ({currencySymbol()})
            </label>
            <input
              id="p-price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>

          <div className="field">
            <label className="mono" htmlFor="p-cat">
              Category
            </label>
            <select
              id="p-cat"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="mono" htmlFor="p-tag">
              Tag
            </label>
            <select
              id="p-tag"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t || "None"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="pform__stock">
          <legend className="mono">Stock per size</legend>
          <div className="pform__sizes">
            {SIZE_ORDER.map((s) => (
              <div className="field" key={s}>
                <label className="mono" htmlFor={`stock-${s}`}>
                  {s}
                </label>
                <input
                  id={`stock-${s}`}
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={form.stock[s]}
                  onChange={(e) => setStock(s, e.target.value)}
                />
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="pform__col">
        <div className="pform__photos">
          <div className="pform__photos-head">
            <span className="mono">Photos</span>
            <label className="btn pform__upload">
              {uploading ? "Uploading…" : "Add photos"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={onFiles}
                disabled={uploading}
                hidden
              />
            </label>
          </div>
          <p className="pform__hint">
            The first photo is the main image, the second shows on hover.
          </p>

          {form.images.length === 0 ? (
            <p className="pform__empty mono">No photos yet</p>
          ) : (
            <ul className="pform__grid">
              {form.images.map((url, i) => (
                <li key={url} className="thumb">
                  <img src={url} alt="" />
                  {i === 0 && <span className="thumb__main mono">Main</span>}
                  <div className="thumb__actions mono">
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      disabled={i === 0}
                      aria-label="Move earlier"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, i + 1)}
                      disabled={i === form.images.length - 1}
                      aria-label="Move later"
                    >
                      →
                    </button>
                    <button type="button" onClick={() => removeImage(url)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="pform__publish">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          <span>
            <strong>Published</strong>
            <span className="pform__hint">
              {form.published
                ? "Visible in the shop."
                : "Hidden from the shop (draft)."}
            </span>
          </span>
        </label>

        {error && (
          <p className="login__error mono" role="alert">
            {error}
          </p>
        )}

        <div className="pform__actions">
          <button type="submit" className="btn" disabled={busy}>
            {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
          </button>
          <button
            type="button"
            className="pform__link mono"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          {!isNew && (
            <button
              type="button"
              className="pform__link pform__link--danger mono"
              onClick={handleDelete}
              disabled={busy}
            >
              Delete
            </button>
          )}
        </div>

        {!isNew && (
          <Link
            className="mono pform__view"
            to={`/product/${form.slug}`}
            target="_blank"
          >
            View on store ↗
          </Link>
        )}
      </div>
    </form>
  );
}