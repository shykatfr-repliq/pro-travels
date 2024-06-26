"use client";

import PackageCard from "../common/Cards/PackageCard";
import SectionTitle from "../common/SectionTitle";
import { FaFilter } from "react-icons/fa6";
import FilterOption from "./FilterOption";
import { useQuery } from "@tanstack/react-query";
import { handleFetchAllPackages } from "@/utils";
import LoadingCard from "../loading/Card";
import { useRef, useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

const Packages = () => {
  const [page, setPage] = useState(1);
  const packagesRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: handleFetchAllPackages,
    staleTime: 10000,
  });

  // filtering logics
  const [filterKey, setFilterKey] = useState([]);

  let upcommingData = [];
  let featuredData = [];
  let bestRating = [];
  let highTOlow = [];
  let lowTOhigh = [];
  let filterData = [];

  if (filterKey.includes("Upcomming")) {
    upcommingData = data.filter((item) => item.isUpcomming);
  }
  if (filterKey.includes("Featured")) {
    featuredData = data.filter((item) => item.isFeatured);
  }

  if (filterKey.includes("Best Rating")) {
    const sortedItems = [...data];
    bestRating = sortedItems.sort((a, b) => b.ratings - a.ratings);
  }

  if (filterKey.includes("Price (High to Low)")) {
    const sortedItems = [...data];
    highTOlow = sortedItems.sort((a, b) => b.price - a.price);
  }

  if (filterKey.includes("Price (Low to High)")) {
    const sortedItems = [...data];
    lowTOhigh = sortedItems.sort((a, b) => a.price - b.price);
  }

  if (
    upcommingData !== undefined ||
    featuredData !== undefined ||
    bestRating !== undefined ||
    highTOlow !== undefined ||
    lowTOhigh !== undefined
  ) {
    filterData = upcommingData
      .concat(featuredData)
      .concat(bestRating)
      .concat(highTOlow)
      .concat(lowTOhigh);
  }

  // pagination logics
  const selectedPage = (pageIndex) => {
    if (pageIndex >= 1 && pageIndex <= data.length / 6) {
      setPage(pageIndex);
      packagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="py-10" ref={packagesRef}>
      <SectionTitle
        title="Select your package"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis officiis facilis voluptatem? Dolores, libero sunt?"
      />

      <div className="w-full flex flex-col md:flex-row justify-end gap-6 mt-10 relative">
        <div className="md:w-1/5 bg-brandText rounded-lg bg-opacity-10 p-6 ">
          <h2 className="flex items-center gap-2 underline">
            <FaFilter className="text-brandText" /> Filter your search
          </h2>

          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <FilterOption
                label="Upcomming"
                reg="upcomming"
                setFilterKey={setFilterKey}
              />
            </li>

            <li>
              <FilterOption
                label="Featured"
                reg="featured"
                setFilterKey={setFilterKey}
              />
            </li>
            <li>
              <FilterOption
                label="Best Rating"
                reg="rating"
                setFilterKey={setFilterKey}
              />
            </li>
            <li>
              <FilterOption
                label="Price (Low to High)"
                reg="low"
                setFilterKey={setFilterKey}
              />
            </li>
            <li>
              <FilterOption
                label="Price (High to Low)"
                reg="high"
                setFilterKey={setFilterKey}
              />
            </li>
          </ul>
        </div>

        {isLoading ? (
          <div className="w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : (
          <div className="md:w-4/5">
            {filterKey.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <p className="px-3 py-1.5 bg-brandText text-sm dark:bg-opacity-30 bg-opacity-10 rounded-md">
                  Filter Applied:
                </p>
                {filterKey.map((item, i) => {
                  return (
                    <p
                      key={i}
                      className="px-3 py-1.5 bg-brandText text-sm dark:bg-opacity-10 bg-opacity-10 rounded-md"
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
            )}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterKey.length === 0
                ? data.slice(page * 6 - 6, page * 6).map((d) => {
                    return <PackageCard key={d.id} pack={d} />;
                  })
                : filterData.map((d) => {
                    return <PackageCard key={d.id} pack={d} />;
                  })}
            </div>

            {/* Pagination */}
            {filterKey.length === 0 && (
              <div className="w-full flex justify-end mt-6">
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => selectedPage(page - 1)}
                    className={`size-10 text-neutral-500 dark:text-neutral-300 duration-300 hover:text-black dark:hover:text-white border rounded-md flex justify-center items-center cursor-pointer ${
                      page > 1 ? "" : "opacity-30"
                    }`}
                  >
                    <FaCaretLeft />
                  </span>
                  {[...Array(data.length / 6)].map((_, i) => {
                    return (
                      <span
                        key={i}
                        onClick={() => selectedPage(i + 1)}
                        className={`size-10 duration-300 hover:text-black dark:hover:text-white border rounded-md flex justify-center items-center cursor-pointer ${
                          page === i + 1 && "text-brandText border-brandText"
                        }`}
                      >
                        {i + 1}
                      </span>
                    );
                  })}
                  <span
                    onClick={() => selectedPage(page + 1)}
                    className={`size-10 text-neutral-500 dark:text-neutral-300 duration-300 hover:text-black dark:hover:text-white border rounded-md flex justify-center items-center cursor-pointer ${
                      page < data.length / 6 ? "" : "opacity-30"
                    }`}
                  >
                    <FaCaretRight />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
