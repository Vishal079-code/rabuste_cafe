import { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import "../styles/MenuViewer.css";

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

/* ================= HELPERS (FROM PART 1) ================= */

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

/* ================= COMPONENT ================= */

export default function MenuViewer() {
  const [data, setData] = useState({
    categories: [],
    subCategories: [],
    items: []
  });

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const pageRef = useRef(null);
  const overlayShadowRef = useRef(null);
  const contentScope = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/debug/menu-full")
      .then((r) => r.json())
      .then(setData);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".menu-section-group", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4
      });
    }, contentScope);
    return () => ctx.revert();
  }, [index, data]);

  const handlePageTurn = (direction) => {
    if (isAnimating) return;

    const nextIndex =
      direction === "next"
        ? (index + 1) % MENU_TABS.length
        : (index - 1 + MENU_TABS.length) % MENU_TABS.length;

    setIsAnimating(true);

    gsap
      .timeline({
        onComplete: () => {
          setIndex(nextIndex);
          setIsAnimating(false);
          gsap.set(pageRef.current, { clearProps: "all" });
        }
      })
      .to(pageRef.current, {
        duration: 1.2,
        rotateY: direction === "next" ? -110 : 110,
        skewY: direction === "next" ? 5 : -5,
        x: direction === "next" ? -100 : 100,
        scale: 0.9,
        transformOrigin:
          direction === "next" ? "left center" : "right center",
        ease: "power2.inOut"
      })
      .to(overlayShadowRef.current, { opacity: 0.4, duration: 0.5 }, 0);
  };

  return (
    <div className="menu-viewer-root" ref={contentScope}>
      <div className="menu-controls">
        <button className="nav-arrow" onClick={() => handlePageTurn("prev")}>‹</button>

        <div className="title-stack">
          <span className="page-indicator">
            {MENU_TABS[index].toUpperCase()}
          </span>
          <div className="indicator-line" />
        </div>

        <button className="nav-arrow" onClick={() => handlePageTurn("next")}>›</button>
      </div>

      <div className="book-container">
        <div className="page-underlay">
          <MenuContent
            data={data}
            categoryId={CATEGORY_ID_MAP[MENU_TABS[(index + 1) % MENU_TABS.length]]}
          />
        </div>

        <div className="page-leaf" ref={pageRef}>
          <div className="leaf-front">
            <MenuContent
              data={data}
              categoryId={CATEGORY_ID_MAP[MENU_TABS[index]]}
            />
            <div className="curl-shadow" ref={overlayShadowRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MENU CONTENT (PART-1 LOGIC) ================= */

function MenuContent({ data, categoryId }) {
  return (
    <div className="paper-sheet">
      <div className="paper-border">
        <div className="paper-scroll-area">

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

              const sections = items.reduce((acc, item) => {
                acc[item.section || "GENERAL"] ??= [];
                acc[item.section || "GENERAL"].push(item);
                return acc;
              }, {});

              return (
                <div key={subId} className="menu-section-group">
                  <h3 className="section-bifurcation">
                    {sub.name.toUpperCase()}
                  </h3>

                  {Object.entries(sections).map(([sec, items]) => (
                    <div key={sec} style={{ marginLeft: 12 }}>
                      <h4 className="section-label">{sec}</h4>

                      {items.map((item) => {
                        const { final, strike, label } =
                          getFinalPrice(item);

                        return (
                          <div
                            key={item.id}
                            className="menu-entry"
                            style={{
                              opacity: item.isActive === false ? 0.4 : 1
                            }}
                          >
                            <div className="entry-main">
                              <div className="name-group">
                                <span className="entry-name">
                                  {item.name}
                                </span>

                                <div className="entry-tags">
                                  <span
                                    className={
                                      item.inStock
                                        ? "tag-in"
                                        : "tag-out"
                                    }
                                  >
                                    {item.inStock
                                      ? "IN STOCK"
                                      : "OUT OF STOCK"}
                                  </span>

                                  {label && (
                                    <span className="tag-promo">
                                      {label}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="entry-price">
                                {strike && (
                                  <div className="price-strike">
                                    ₹{strike}
                                  </div>
                                )}
                                <div className="price-final">
                                  ₹{final ?? "—"}
                                </div>
                              </div>
                            </div>

                            <div className="entry-line" />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}

          <div className="paper-footer">
            — End of Selection —
          </div>
        </div>
      </div>
    </div>
  );
}
