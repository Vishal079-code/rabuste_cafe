import { useEffect, useState } from "react";
import "../styles/global.css";

const MENU_TABS = [
  "Robusta Speciality Coffee",
  "Blend Coffee",
  "Manual Brew",
  "Non Coffee Drinks",
  "Savoury"
];

const CATEGORY_KEY_MAP = {
  "Robusta Speciality Coffee": "robusta",
  "Blend Coffee": "blend",
  "Manual Brew": "manual",
  "Non Coffee Drinks": "noncoffee",
  "Savoury": "food"
};

export default function MenuViewer() {
  const [data, setData] = useState({ categories: [], subCategories: [], items: [] });
  const [activeTab, setActiveTab] = useState("Robusta Speciality Coffee");

  useEffect(() => {
    fetch("http://localhost:5000/debug/menu-full")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const categoryKey = CATEGORY_KEY_MAP[activeTab];

  return (
    <div className="page menu-viewer" style={{ padding: 32 }}>
      {/* TABS */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {MENU_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid var(--accent-soft)",
              background: activeTab === t ? "var(--accent-soft)" : "transparent",
              color: activeTab === t ? "#fff" : "var(--accent-soft)"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <h2 className="section-title">{activeTab.toUpperCase()}</h2>

      {/* SUBCATEGORIES */}
      {data.subCategories
        .filter((sub) => sub.category?.includes(categoryKey))
        .map((sub) => {
          const subKey =
            "sub_" +
            categoryKey +
            "_" +
            sub.name.toLowerCase().replace(" ", "");

          const subItems = data.items.filter((i) =>
            i.subCategoryId?.includes(subKey)
          );

          if (!subItems.length) return null;

          const sections = subItems.reduce((acc, item) => {
            const sec = item.section || "GENERAL";
            acc[sec] = acc[sec] || [];
            acc[sec].push(item);
            return acc;
          }, {});

          return (
            <div key={subKey} style={{ marginTop: 32 }}>
              <h3 className="section-kicker">{sub.name.toUpperCase()}</h3>

              {Object.entries(sections).map(([section, items]) => (
                <div key={section} style={{ marginLeft: 12 }}>
                  <h4 style={{ color: "var(--accent-soft)" }}>{section}</h4>

                  {items.map((item, idx) => (
                    <div
                      key={`${subKey}-${idx}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: "1px solid rgba(216,107,50,0.2)"
                      }}
                    >
                      <span>{item.name}</span>
                      <span>₹{item.prices?.[0]?.price ?? "—"}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}
