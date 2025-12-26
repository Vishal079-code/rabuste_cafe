import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
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

function buildSubCategoryId(categoryId, subName) {
  const clean = subName.toLowerCase().replace(/\s+/g, "_");

  if (clean === "shake") return "sub_shake";
  if (clean === "cold_tea") return "sub_tea";
  if (clean === "food_items") return "sub_food";
  if (clean === "manual_brew") return "sub_manual";

  return `sub_${categoryId.replace("cat_", "")}_${clean}`;
}

function getFinalPrice(item) {
  const base = item.prices?.[0]?.price;
  if (!base || !item.discount)
    return { final: base, strike: null, label: null };

  if (item.discount.type === "PERCENT") {
    const d = Math.round(base - (base * item.discount.value) / 100);
    return {
      final: d,
      strike: base,
      label: item.discount.label || `${item.discount.value}% OFF`
    };
  }

  if (item.discount.type === "FLAT") {
    const d = base - item.discount.value;
    return {
      final: d,
      strike: base,
      label: item.discount.label || `₹${item.discount.value} OFF`
    };
  }

  return { final: base, strike: null, label: null };
}

/* ================= PAGE CONTENT ================= */

function MenuPage({ data, categoryId }) {
  return (
    <>
      {data.subCategories
        .filter((s) => s.category === categoryId)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((sub) => {
          const subId = buildSubCategoryId(categoryId, sub.name);

          const items = data.items.filter(
            (i) =>
              i.categoryId === categoryId &&
              i.subCategoryId === subId
          );

          if (!items.length) return null;

          const sections = items.reduce((a, i) => {
            a[i.section || "GENERAL"] ??= [];
            a[i.section || "GENERAL"].push(i);
            return a;
          }, {});

          return (
            <div key={subId} style={{ marginBottom: 32 }}>
              <h3 className="section-kicker">{sub.name.toUpperCase()}</h3>

              {Object.entries(sections).map(([sec, items]) => (
                <div key={sec} style={{ marginLeft: 12 }}>
                  <h4 style={{ color: "var(--accent-soft)" }}>{sec}</h4>

                  {items.map((item) => {
                    const { final, strike, label } =
                      getFinalPrice(item);

                    return (
                      <div
                        key={item.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom:
                            "1px solid rgba(216,107,50,0.2)",
                          opacity: item.isActive === false ? 0.4 : 1
                        }}
                      >
                        <div>
                          <div>{item.name}</div>
                          <div style={{ fontSize: 11, marginTop: 4 }}>
                            <span
                              style={{
                                color: item.inStock
                                  ? "#3ad67a"
                                  : "#ff5c5c"
                              }}
                            >
                              {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                            </span>
                            {label && (
                              <span style={{ marginLeft: 8, color: "#ff8c00" }}>
                                {label}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          {strike && (
                            <div
                              style={{
                                textDecoration: "line-through",
                                fontSize: 12,
                                opacity: 0.6
                              }}
                            >
                              ₹{strike}
                            </div>
                          )}
                          <div style={{ fontWeight: 600 }}>
                            ₹{final ?? "—"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
    </>
  );
}

/* ================= COMPONENT ================= */

export default function MenuViewer() {
  const [data, setData] = useState({
    categories: [],
    subCategories: [],
    items: []
  });

  const [index, setIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(null);
  const [direction, setDirection] = useState("next");

  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/debug/menu-full")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const goNext = () => {
    setDirection("next");
    setTargetIndex((index + 1) % MENU_TABS.length);
  };

  const goPrev = () => {
    setDirection("prev");
    setTargetIndex(
      index === 0 ? MENU_TABS.length - 1 : index - 1
    );
  };

  /* ===== TRUE FRONT/BACK PAGE TURN ===== */
  useEffect(() => {
    if (targetIndex === null) return;

    const isNext = direction === "next";
    const rot = isNext ? -180 : 180;
    const origin = isNext ? "right center" : "left center";

    gsap.set(backRef.current, {
      rotateY: isNext ? 180 : -180,
      scaleX: -1,
      backfaceVisibility: "hidden"
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIndex(targetIndex);
        setTargetIndex(null);
        gsap.set([frontRef.current, backRef.current], {
          clearProps: "all"
        });
      }
    });

    tl.to(frontRef.current, {
      rotateY: rot,
      transformOrigin: origin,
      duration: 1.2,
      ease: "power2.inOut"
    }).to(
      backRef.current,
      {
        rotateY: 0,
        scaleX: 1,
        duration: 1.2,
        ease: "power2.inOut"
      },
      0
    );
  }, [targetIndex]);

  const activeCat = CATEGORY_ID_MAP[MENU_TABS[index]];
  const targetCat =
    targetIndex !== null
      ? CATEGORY_ID_MAP[MENU_TABS[targetIndex]]
      : null;

  return (
    <div className="page menu-viewer" style={{ padding: 32 }}>
      {/* CONTROLS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16
        }}
      >
        <button onClick={goPrev} style={navBtnStyle}>‹</button>
        <h2 className="section-title">{MENU_TABS[index].toUpperCase()}</h2>
        <button onClick={goNext} style={navBtnStyle}>›</button>
      </div>

      {/* BOOK */}
      <div style={{ position: "relative", perspective: 2000 }}>
        <div
          ref={backRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "#0f0f0f",
            padding: 24,
            borderRadius: 12
          }}
        >
          {targetCat && <MenuPage data={data} categoryId={targetCat} />}
        </div>

        <div
          ref={frontRef}
          style={{
            background: "#0f0f0f",
            padding: 24,
            borderRadius: 12,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
          }}
        >
          <MenuPage data={data} categoryId={activeCat} />
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const navBtnStyle = {
  fontSize: 28,
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "1px solid var(--accent-soft)",
  background: "transparent",
  color: "var(--accent-soft)",
  cursor: "pointer"
};
