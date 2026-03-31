import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Context } from "../index.js";
import { fetchBrands, fetchTypes, fetchAllDevices } from "../http/deviceApi.js";
import { ABOUT_ROUTE } from "../utils/consts.js";
import PreviewDeviceList from "../components/PreviewDeviceList.js";
import { FunnelIcon } from "@heroicons/react/24/outline";

const inputClass =
  "mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15";

const SearchField = ({ searchQuery, setSearchQuery }) => (
  <div className="rounded-[20px] border border-[var(--color-border)] bg-white/90 p-3 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Qidiruv
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
          Nomi, brand yoki type bo'yicha
        </p>
      </div>
      {searchQuery ? (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)] transition-all hover:border-[var(--color-accent)]/35 hover:text-[var(--color-text-primary)]"
        >
          Clear
        </button>
      ) : null}
    </div>
    <label className="mt-3 block text-[11px] text-[var(--color-text-muted)]">
      Kalit so'z
      <input
        type="text"
        value={searchQuery}
        placeholder="Nomi yoki brand bo'yicha qidiring"
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15"
      />
    </label>
  </div>
);

const FilterFields = ({
  device,
  selectedBrand,
  setSelectedBrand,
  selectedType,
  setSelectedType,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  onClear,
}) => (
  <>
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
      Filtrlash
    </p>
    <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
      <label className="block text-[12px] text-[var(--color-text-muted)]">
        Brand
        <select
          value={selectedBrand.id || ""}
          onChange={(e) => {
            const found = device.brands.find(
              (b) => String(b.id) === e.target.value
            );
            setSelectedBrand(found || {});
          }}
          className={inputClass}
        >
          <option value="">All brands</option>
          {device.brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[12px] text-[var(--color-text-muted)]">
        Type
        <select
          value={selectedType.id || ""}
          onChange={(e) => {
            const found = device.types.find(
              (t) => String(t.id) === e.target.value
            );
            setSelectedType(found || {});
          }}
          className={inputClass}
        >
          <option value="">All types</option>
          {device.types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2 md:col-span-3 lg:col-span-1 lg:grid-cols-2">
        <label className="block text-[12px] text-[var(--color-text-muted)]">
          Min
          <input
            type="number"
            value={priceMin}
            placeholder="0"
            onChange={(e) => setPriceMin(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-[12px] text-[var(--color-text-muted)]">
          Max
          <input
            type="number"
            value={priceMax}
            placeholder="∞"
            onChange={(e) => setPriceMax(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
    </div>
    <button
      type="button"
      onClick={onClear}
      className="mt-4 w-full rounded-full border border-[var(--color-border)] bg-white py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] shadow-sm transition-all hover:border-[var(--color-accent)]/35 hover:text-[var(--color-text-primary)]"
    >
      Filtrni tozalash
    </button>
  </>
);

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const adjustedStart = Math.max(1, endPage - 4);

  return Array.from(
    { length: endPage - adjustedStart + 1 },
    (_, index) => adjustedStart + index
  );
};

const Shop = observer(() => {
  const { device } = useContext(Context);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [pageDirection, setPageDirection] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState({});
  const [selectedType, setSelectedType] = useState({});
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [allDevices, setAllDevices] = useState([]);

  const changePage = (nextPage) => {
    if (nextPage === device.page || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPageDirection(nextPage > device.page ? 1 : -1);
    device.setPage(nextPage);
  };

  const clearFilters = () => {
    setSelectedBrand({});
    setSelectedType({});
    setPriceMin("");
    setPriceMax("");
    setSearchQuery("");
  };

  useEffect(() => {
    setCatalogLoading(true);
    Promise.all([fetchBrands(), fetchTypes(), fetchAllDevices()])
      .then(([brands, types, devicesData]) => {
        device.setBrands(brands);
        device.setTypes(types);
        setAllDevices(devicesData);
      })
      .catch((err) => console.error("Catalog bootstrap error:", err))
      .finally(() => setCatalogLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only bootstrap
  }, []);

  useEffect(() => {
    if (device.page !== 1) {
      setPageDirection(0);
      device.setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset pagination on filter changes
  }, [searchQuery, priceMin, priceMax, selectedBrand, selectedType]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredDevices = allDevices.filter((item) => {
    if (selectedBrand.id && item.brandId !== selectedBrand.id) {
      return false;
    }
    if (selectedType.id && item.typeId !== selectedType.id) {
      return false;
    }

    const brandName =
      device.brands.find((brand) => brand.id === item.brandId)?.name || "";
    const typeName =
      device.types.find((type) => type.id === item.typeId)?.name || "";
    const searchableText = [item.name, brandName, typeName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (normalizedSearch && !searchableText.includes(normalizedSearch)) {
      return false;
    }
    if (priceMin && Number(item.price) < Number(priceMin)) return false;
    if (priceMax && Number(item.price) > Number(priceMax)) return false;
    return true;
  });
  const totalCount = filteredDevices.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / device.limit));
  const visiblePages = getVisiblePages(device.page, totalPages);
  const pageStart = (device.page - 1) * device.limit;
  const paginatedDevices = filteredDevices.slice(
    pageStart,
    pageStart + device.limit
  );
  const hasLocalFilters = Boolean(
    normalizedSearch ||
      priceMin ||
      priceMax ||
      selectedBrand.id ||
      selectedType.id
  );

  const filterProps = {
    device,
    selectedBrand,
    setSelectedBrand,
    selectedType,
    setSelectedType,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    onClear: clearFilters,
  };

  return (
    <div className="px-2">
      <div
        className="pointer-events-none absolute -right-16 top-32 h-64 w-64 rounded-full border border-[var(--color-accent)]/15 opacity-90 animate-slide-up"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-40 h-48 w-48 rounded-full bg-[var(--color-accent-soft)] blur-3xl animate-fade-in"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply luxury-noise"
        aria-hidden
      />


      <div className="relative z-10 mt-8 lg:grid lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:gap-10 lg:items-start">
        {/* SIDEBAR FILTERS — desktop */}
        <aside className="relative hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <section className="space-y-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <SearchField
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <FilterFields {...filterProps} />
          </section>
        </aside>

        <div className="min-w-0">
          {/* TABLET FILTERS */}
          <section className="relative z-10 mt-0 hidden space-y-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm md:block lg:hidden">
            <SearchField
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <FilterFields {...filterProps} />
          </section>

          {/* INVENTORY */}
          <section className="relative z-10 mt-8 flex flex-col gap-4 lg:mt-0">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Ombor
                </p>
                <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)] md:text-3xl">
                  Imzo tugunlari
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-[var(--color-accent)] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] shadow-sm hover:border-[var(--color-accent)]/35"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-[var(--color-accent)] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] shadow-sm hover:border-[var(--color-accent)]/35"
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between md:hidden">
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/35 active:scale-[0.98]"
              >
                <FunnelIcon className="h-4 w-4 text-[var(--color-accent)]" />
                Filters
              </button>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {viewMode} view
              </span>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm md:hidden">
              <SearchField
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </section>

          <AnimatePresence initial={false} mode="wait" custom={pageDirection}>
            <motion.div
              key={`${device.page}-${viewMode}`}
              custom={pageDirection}
              variants={{
                enter: (direction) => ({
                  opacity: 0,
                  x: direction >= 0 ? 64 : -64,
                }),
                center: {
                  opacity: 1,
                  x: 0,
                },
                exit: (direction) => ({
                  opacity: 0,
                  x: direction >= 0 ? -64 : 64,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <PreviewDeviceList
                devices={catalogLoading ? [] : paginatedDevices}
                viewMode={viewMode}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Navigatsiya
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                Sahifa {device.page} / {totalPages}
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                {catalogLoading
                  ? "Mahsulotlar yuklanmoqda"
                  : hasLocalFilters
                    ? `Qidiruv va filtrlarda ${totalCount} ta mahsulot topildi`
                    : `Jami ${totalCount} ta mahsulot mavjud`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => changePage(device.page - 1)}
                disabled={device.page === 1}
                className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-primary)] shadow-sm transition-all hover:-translate-x-0.5 hover:border-[var(--color-accent)]/35 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>

              {visiblePages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => changePage(pageNumber)}
                  aria-current={pageNumber === device.page ? "page" : undefined}
                  className={`h-10 min-w-10 rounded-full px-3 text-[11px] font-bold transition-all ${
                    pageNumber === device.page
                      ? "scale-105 border border-[var(--color-accent)] bg-[var(--color-accent)] text-white ring-4 ring-[var(--color-accent)]/20 shadow-[0_12px_30px_rgba(37,99,235,0.4)]"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-accent)]/35"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => changePage(device.page + 1)}
                disabled={device.page === totalPages}
                className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-primary)] shadow-sm transition-all hover:translate-x-0.5 hover:border-[var(--color-accent)]/35 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          <section className="relative z-10 mt-10">
            <Link
              to={ABOUT_ROUTE}
              className="flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] py-4 text-[13px] font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              View manifest &amp; ethos
            </Link>
          </section>
        </div>
      </div>

      {showMobileFilters && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setShowMobileFilters(false)}
          role="presentation"
        >
          <div
            className="absolute inset-x-4 top-24 space-y-4 rounded-[24px] border border-[var(--color-border)] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.15)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-label="Filters"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg text-[var(--color-text-primary)]">
                Filters
              </h4>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)]"
              >
                Close
              </button>
            </div>
            <SearchField
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <label className="block text-[12px] text-[var(--color-text-muted)]">
              Brand
              <select
                value={selectedBrand.id || ""}
                onChange={(e) => {
                  const found = device.brands.find(
                    (b) => String(b.id) === e.target.value
                  );
                  setSelectedBrand(found || {});
                }}
                className={inputClass}
              >
                <option value="">All brands</option>
                {device.brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[12px] text-[var(--color-text-muted)]">
              Type
              <select
                value={selectedType.id || ""}
                onChange={(e) => {
                  const found = device.types.find(
                    (t) => String(t.id) === e.target.value
                  );
                  setSelectedType(found || {});
                }}
                className={inputClass}
              >
                <option value="">All types</option>
                {device.types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={priceMin}
                placeholder="Min"
                onChange={(e) => setPriceMin(e.target.value)}
                className={inputClass + " mt-0"}
              />
              <input
                type="number"
                value={priceMax}
                placeholder="Max"
                onChange={(e) => setPriceMax(e.target.value)}
                className={inputClass + " mt-0"}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                clearFilters();
              }}
              className="w-full rounded-full border border-[var(--color-border)] py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Shop;
