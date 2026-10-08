import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../lib/products";
import Button from "../../components/Button";

const totalStock = (p) =>
  Object.values(p.stock ?? {}).reduce((a, b) => a + Number(b || 0), 0);

export default function AdminProducts() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("id")
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setRows(data);
      });
  }, []);

  const setPublished = (id, published) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, published } : x)));

  const togglePublished = async (p) => {
    const next = !p.published;
    setPublished(p.id, next); // instant, undone if it fails

    const { error: err } = await supabase
      .from("products")
      .update({ published: next })
      .eq("id", p.id);

    if (err) {
      setError(err.message);
      setPublished(p.id, !next);
    }
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="display admin-title">products</h1>
          <p className="mono admin-sub">
            {rows ? `${rows.length} total` : "Loading…"}
          </p>
        </div>
        <Button to="/admin/products/new">New product</Button>
      </div>

      {error && <p className="mono">{error}</p>}

      {rows && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="mini">
                      {p.images?.[0] && <img src={p.images[0]} alt="" />}
                    </div>
                  </td>
                  <td>{p.name}</td>
                  <td className="mono">{p.category}</td>
                  <td className="mono">{formatPrice(p.price_cents / 100)}</td>
                  <td className="mono">{totalStock(p)}</td>
                  <td>
                    <button
                      type="button"
                      className={`badge mono ${p.published ? "badge--on" : ""}`}
                      onClick={() => togglePublished(p)}
                      title="Click to change"
                    >
                      {p.published ? "Live" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <Link className="mono" to={`/admin/products/${p.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}