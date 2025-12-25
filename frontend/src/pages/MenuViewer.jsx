import { useEffect, useState } from "react";
import "../styles/global.css";

export default function MenuViewer() {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/debug/menu-full");
        const data = await res.json();

        // Group items by category -> subcategory -> section
        const grouped = data.categories.map((cat) => {
          const subs = data.subCategories
            .filter((sub) => sub.categoryId === cat._id)
            .map((sub) => {
              const items = data.items
                .filter((item) => item.subCategoryId === sub._id)
                // group by item.section (COLD, HOT, etc)
                .reduce((acc, item) => {
                  const section = item.section || "GENERAL";
                  if (!acc[section]) acc[section] = [];
                  acc[section].push(item);
                  return acc;
                }, {});

              return { ...sub, sections: items };
            });

          return { ...cat, subCategories: subs };
        });

        setMenuData(grouped);
      } catch (err) {
        console.error("Failed to load menu:", err);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="page menu-viewer" style={{ padding: "40px 20px" }}>
      {menuData.map((cat) => (
        <section key={cat._id} className="category-section">
          <h2 className="section-title">{cat.name.toUpperCase()}</h2>

          {cat.subCategories.map((sub) => (
            <div key={sub._id} className="subcategory-section" style={{ marginBottom: "32px" }}>
              <h3 className="section-kicker">{sub.name.toUpperCase()}</h3>

              {Object.keys(sub.sections).map((sectionName) => (
                <div key={sectionName} className="section-items" style={{ marginBottom: "16px" }}>
                  <h4 style={{ color: "var(--accent-soft)", marginBottom: "8px" }}>{sectionName.toUpperCase()}</h4>

                  {sub.sections[sectionName].map((item) => (
                    <div
                      key={item._id}
                      className={`menu-item ${!item.inStock ? "sold" : "availability"}`}
                      style={{
                        padding: "6px 12px",
                        borderBottom: "1px solid rgba(216,107,50,0.2)",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
                        <span>{item.name}</span>
                        <span>₹{item.prices?.[0]?.price || "—"}</span>
                      </div>

                      {item.description && (
                        <div
                          className="desc"
                          style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "2px" }}
                        >
                          {item.description}
                        </div>
                      )}

                      {item.isDiscount > 0 && (
                        <div style={{ color: "var(--accent-soft)", fontSize: "0.8rem", marginTop: "2px" }}>
                          {item.isDiscount}% OFF
                        </div>
                      )}

                      {!item.inStock && (
                        <div style={{ color: "#ff7a7a", fontSize: "0.8rem", marginTop: "2px" }}>
                          Out of stock
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
