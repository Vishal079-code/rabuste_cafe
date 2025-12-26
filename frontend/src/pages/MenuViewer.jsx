import { useEffect, useState } from "react";
import "../styles/global.css";

/* ================= CONFIG ================= */

const MENU_TABS = [
  "Robusta Speciality Coffee",
  "Blend Coffee",
  "Manual Brew",
  "Non Coffee Drinks",
  "Savoury"
];

const CATEGORY_ID_MAP = {
  "Robusta Speciality Coffee": "cat_robusta",
  "Blend Coffee": "cat_blend",
  "Manual Brew": "cat_manual",
  "Non Coffee Drinks": "cat_noncoffee",
  "Savoury": "cat_food"
};

/* ================= HELPERS ================= */

// convert subcategory name to backend id
function buildSubCategoryId(categoryId, subName) {
  const clean = subName.toLowerCase().replace(/\s+/g, "_");

  // special cases (from your data)
  if (clean === "shake") return "sub_shake";
  if (clean === "cold_tea") return "sub_tea";
  if (clean === "food_items") return "sub_food";
  if (clean === "manual_brew") return "sub_manual";

  // default (robusta / blend hot-cold)
  return `sub_${categoryId.replace("cat_", "")}_${clean}`;
}

/* ================= COMPONENT ================= */

export default function MenuViewer() {
  const [data, setData] = useState({
    categories: [],
    subCategories: [],
    items: []
  });

  const [activeTab, setActiveTab] = useState(
    "Robusta Speciality Coffee"
  );

  useEffect(() => {
    fetch("http://localhost:5000/debug/menu-full")
      .then((r) => r.json())
      .then((res) => {
        console.log("MENU DATA", res);
        setData(res);
      })
      .catch(console.error);
  }, []);

  const activeCategoryId = CATEGORY_ID_MAP[activeTab];

  return (
    <div className="page menu-viewer" style={{ padding: 32 }}>
      {/* -------- TABS -------- */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {MENU_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid var(--accent-soft)",
              background: activeTab === tab ? "var(--accent-soft)" : "transparent",
              color: activeTab === tab ? "#fff" : "var(--accent-soft)"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <h2 className="section-title">{activeTab.toUpperCase()}</h2>

      {/* -------- SUBCATEGORIES -------- */}
      {data.subCategories
        .filter((sub) => sub.category === activeCategoryId)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((sub) => {
          const subCategoryId = buildSubCategoryId(
            activeCategoryId,
            sub.name
          );

          const subItems = data.items.filter(
            (item) =>
              item.categoryId === activeCategoryId &&
              item.subCategoryId === subCategoryId
          );

          if (!subItems.length) return null;

          const sections = subItems.reduce((acc, item) => {
            const key = item.section || "GENERAL";
            acc[key] = acc[key] || [];
            acc[key].push(item);
            return acc;
          }, {});

          return (
            <div key={subCategoryId} style={{ marginTop: 32 }}>
              <h3 className="section-kicker">{sub.name.toUpperCase()}</h3>

              {Object.entries(sections).map(([section, items]) => (
                <div key={section} style={{ marginLeft: 12 }}>
                  <h4 style={{ color: "var(--accent-soft)" }}>{section}</h4>

                  {items.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: "1px solid rgba(216,107,50,0.2)",
                        opacity: item.isActive === false ? 0.5 : 1
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
