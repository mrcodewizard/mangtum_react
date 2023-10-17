import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../store/product";

const FilterOption = ({ item, optionIndex, optionItem }) => {
  const { filterArray, filterQuery } = useSelector((state) => state.prodLi);
  const dispatch = useDispatch();
  const isExist = filterArray?.some((obj) => obj.id === optionItem.id);

  console.log(filterQuery);
  return (
    <li
      key={optionIndex}
      className="pointer d-flex align-items-center"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(
          productActions.setFilterUniqueArray({
            id: item?.attr_id,
            attribute_value: optionItem.id,
          })
        );
      }}
    >
      <input type="checkbox" className="pointer" checked={isExist} />
      <span className="filterSub_category mt-2 pointer">
        {optionItem.attribute_value}
      </span>
    </li>
  );
};

export default FilterOption;
