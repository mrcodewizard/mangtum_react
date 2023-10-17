import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { images } from "../../utils/images";
import { getFilterProducts, productActions } from "../../store/product";
import { useDispatch, useSelector } from "react-redux";
import { nameToSlug } from "../../utils/helper";
import { useSearchParams } from "react-router-dom";
import { mgtApi } from "../../store/axios";
import FilterOption from "./FilterOption";

const Filters = ({ options, setSmallScreen, setSearchState, setPage }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const {
    filters = [],
    categoryWithSubCategory = {},
    parent_categories = [],
  } = options;
  const {
    filterQuery,
    categoryId,
    subCategoryId,
    keyword,
    filterArray,
    priceRange,
  } = useSelector((state) => state.prodLi);
  const [hasMounted, setHasMounted] = useState(false);

  const [values, setValues] = useState([0, 1000]);

  const searchValue = searchParams.get("search");
  const [permit, setPermit] = useState(true);

  const handleFetch = async (minPrice, maxPrice) => {
    dispatch(
      getFilterProducts(
        keyword,
        minPrice,
        maxPrice,
        categoryId,
        subCategoryId,
        filterQuery,
        filterArray
      )
    );
    setPage(2);
    setSearchState(true);
    setPermit(true);
  };

  const handleSliderChange = (newValues) => {
    dispatch(productActions.setPriceRange([newValues[0], newValues[1]]));
  };

  const handleMinInputChange = (e) => {
    const newMinValue = parseInt(e.target.value);
    if (newMinValue > priceRange[1]) {
      dispatch(productActions.setPriceRange([values[1], values[1]]));
    } else {
      dispatch(productActions.setPriceRange([newMinValue, values[1]]));
    }
  };

  const handleMaxInputChange = (e) => {
    dispatch(
      productActions.setPriceRange([priceRange[0], parseInt(e.target.value)])
    );
  };

  const priceSet = (e) => {
    dispatch(
      productActions.setPriceRange([priceRange[0], parseInt(e.target.value)])
    );
    window.scrollTo(0, 0);
    dispatch(
      getFilterProducts(
        keyword,
        priceRange[0],
        parseInt(e.target.value),
        categoryId,
        subCategoryId,
        filterQuery
      )
    );
  };

  const [openReplyMenuIndex, setOpenReplyMenuIndex] = useState([]);
  const handleReplyClick = (index) => {
    if (openReplyMenuIndex.includes(index)) {
      setOpenReplyMenuIndex(
        openReplyMenuIndex.filter((item) => item !== index)
      );
    } else {
      setOpenReplyMenuIndex([...openReplyMenuIndex, index]);
    }
  };

  const handleClearFetch = () => {
    dispatch(productActions.setFetchPermit(false));
    dispatch(productActions.setFilterQuery(""));
    dispatch(productActions.setSearchParams({}));
  };

  const handleSliderChangeEnd = (newValues) => {
    setValues(newValues);
    dispatch(productActions.setPriceRange([newValues[0], newValues[1]]));
    window.scrollTo(0, 0);
    dispatch(
      getFilterProducts(
        keyword,
        newValues[0],
        newValues[1],
        categoryId,
        subCategoryId,
        filterQuery
      )
    );
  };

  useEffect(() => {
    if (hasMounted) {
      window.scrollTo(0, 0);
      dispatch(
        getFilterProducts(
          keyword,
          priceRange[0],
          priceRange[1],
          categoryId,
          subCategoryId,
          filterQuery
        )
      );
    } else {
      setHasMounted(true);
    }
  }, [filterQuery]);

  return (
    <div className="side-filter">
      <div>
        <div className="filterCategoriesPrice mt-2 mb-2">Price</div>
        <div className="price-inps">
          <div>
            <label className="filterSub_categoryPrice">From $</label>
            <input
              type="number"
              value={priceRange[0]}
              min={1}
              onChange={handleMinInputChange}
              onBlur={(e) => priceSet(e)}
            />
          </div>
          <div>
            <label className="filterSub_categoryPrice">To $</label>
            <input
              type="number"
              value={priceRange[1]}
              max={1000}
              onChange={(e) => handleMaxInputChange(e)}
              onBlur={(e) => priceSet(e)}
            />
          </div>
        </div>
        <div className="slider-container">
          <Slider
            min={1}
            max={1000}
            range
            value={priceRange}
            allowCross={false}
            onChange={handleSliderChange}
            onAfterChange={handleSliderChangeEnd}
            dotStyle={{
              backgroundColor: "#f6a92c",
              borderColor: "#f6a92c",
              width: 24,
              height: 24,
            }}
          />
        </div>

        <div className="side-flex">
          <div className="filterCategories">Categories</div>
          <button className="svg-icon" onClick={(e) => setSmallScreen(false)}>
            <img src={images["x.svg"]} alt="" />
          </button>
        </div>
        {parent_categories?.length > 0 && (
          <ul onClick={() => handleClearFetch()}>
            <li>
              <Link
                to={`/${nameToSlug(categoryWithSubCategory?.cate_name)}`}
                className="main-link"
              >
                <span className="filterCategoriesPrice">
                  {categoryWithSubCategory?.cate_name}
                </span>
              </Link>
            </li>
            <ul>
              {categoryWithSubCategory?.subcategories?.map(
                (subCategoryItem, idx) => {
                  return (
                    <li key={idx}>
                      <Link
                        to={`/${nameToSlug(
                          categoryWithSubCategory.cate_name
                        )}/${nameToSlug(subCategoryItem.subcate_name)}`}
                      >
                        <span className="filterSub_category">
                          {subCategoryItem.subcate_name}
                        </span>
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>

            {parent_categories?.map((item, index) => {
              if (categoryWithSubCategory?.cate_name === item.cate_name) {
                return;
              }
              return (
                <li key={index}>
                  <Link to={`/${item.slug}`}>
                    <span className="filterSub_category">{item.cate_name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <div className="filterCategoriesPrice">Filters</div>
        <ul className="nested-filter">
          {filters?.map((item, index) => (
            <li key={index} className="title-li">
              <span
                className="att-title filterSub_category"
                onClick={(e) => handleReplyClick(index)}
              >
                {item.attr_name}
              </span>
              <i
                className={`fa fa-chevron-down ${
                  openReplyMenuIndex.includes(index) ? "active" : ""
                }`}
                style={{ cursor: "pointer", fontSize: "10px" }}
                onClick={(e) => handleReplyClick(index)}
              ></i>
              {openReplyMenuIndex.includes(index) && (
                <ul>
                  {item.options.length > 0 &&
                    item.options?.map((optionItem, optionIndex) => (
                      <FilterOption
                        item={item}
                        optionIndex={optionIndex}
                        optionItem={optionItem}
                      />
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Filters;
