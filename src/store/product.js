import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mgtApi } from "./axios";
import { convertPayloadToQueryString } from "../utils/helper";
import { getHeaderData } from "./home";

export const getFiterResponse = createAsyncThunk(
  "product/getFiterResponse",
  async ({ attr, prices, category, keyword, thunkAPI }) => {
    const str = await convertPayloadToQueryString(attr);
    const newKeyword = keyword || category;
    try {
      const { data } = await mgtApi.post(
        `/productsearch?keyword=${newKeyword}&price_between=${prices[0]},${prices[1]}&${str}`,
        {
          page: 1,
          keyword: newKeyword,
        }
      );
      return [data, { str, prices, category }];
    } catch (error) {
      // console.log(error);
    }
  }
);

//show the loader
const intialProductState = {
  search_item: null,
  search_total: 0,
  data: [],
  search_page: 1,
  singleProduct: null,
  productByCategory: [],
  plength: [],
  prodNotFound: false,
  galleryimages: [],
  cate_id: {},
  filterList: [],
  productVariations: [],
  variation_status: false,
  beadFilter: [],
  shapeFilter: [],
  styleFilter: [],
  loaderStatus: true,
  related_prod: [],
  vendorInfo: [],
  wishList: [],
  autosuggestProduct: [],
  filterEnabled: false,
  beadCheckboxState: [],
  userCartProductCount: 1,
  statuskey: null,
  message: null,
  filter_array_products: [],
  searchParams: {},
  filterArray: [],
  filterQuery: "",
  products: [],
  fetchPermit: false,
  priceRange: [1, 1000],
  keyword: "",
  total_page: 1,
  categoryId: "",
  subCategoryId: "",
};

const productSlice = createSlice({
  name: "product",
  initialState: intialProductState,
  reducers: {
    productlistsbySubcatSuccess(state, action) {
      state.data = action.payload;
      state.search_total = action.payload.total_pages;
      state.filterEnabled = false;
      state.beadCheckboxState = [];
    },

    singleProductDetailSuccess(state, action) {
      state.singleProduct = action.payload;
      state.galleryimages = state.singleProduct?.product?.gallery; //Object.entries(JSON.parse(state.singleProduct.product.gallery));
      state.userCartProductCount = 1;
    },
    productByCategorySuccess(state, action) {
      state.productByCategory = action.payload;
      state.search_total = action.payload.total_pages;
      state.filterEnabled = false;
      state.beadCheckboxState = [];
    },
    productByCategoryFailure(state, action) {
      state.productByCategory = action.payload;
    },
    productByCategorycount(state, action) {
      state.plength = action.payload;
    },
    category_id(state, action) {
      state.cate_id = action.payload;
    },
    filterListsSuccess(state, action) {
      state.filterList = action.payload;
    },
    filterListsFailure(state, action) {
      state.filterList = action.payload;
    },
    product_variationsList_success(state, action) {
      state.productVariations = action.payload;
      state.variation_status = true;
    },
    product_variationsList_failure(state, action) {
      state.productVariations = action.payload;
      state.variation_status = false;
      state.loaderStatus = false;
    },
    bead_filter(state, action) {
      state.beadFilter = action.payload;
    },
    filterProducts(state, action) {
      state.filter_array_products = action.payload;
      state.search_total = action.payload.total_pages;
      state.filterEnabled = true;
    },
    updatePageNumber(state, action) {
      state.search_page = action.payload.page;
      state.slug = action.payload.slug;
      state.user_id = action.payload.user_id;
    },
    updateLoaderStatus(state, action) {
      state.loaderStatus = action.payload;
    },
    relatedProducts(state, action) {
      state.related_prod = action.payload;
    },
    vendorInfoSuccess(state, action) {
      state.vendorInfo = action.payload;
      state.vendorid = action.payload.vendorid;
    },
    wishAddSuccess(state, action) {
      state.statuskey = "success";
      state.message = "Added to Wishlit";
      state.wishlist_status = action.payload;
    },
    wishRemoveSuccess(state, action) {
      state.statuskey = "success";
      state.message = "Added to Wishlit";
      state.wishlist_status = action.payload;
    },
    fetchWishlist(state, action) {
      state.wishList = action.payload;
    },
    fetch_suggestList_product(state, action) {
      state.autosuggestProduct = action.payload;
    },
    updateBeadCheckboxFilterSuccess(state, action) {
      state.beadCheckboxState = action.payload;
    },
    userCartProductCount(state, action) {
      state.userCartProductCount = action.payload;
    },
    wishAddFailure(state, action) {
      state.status = "error";
      state.message = "Failed to add wishlist";
    },
    setFilterUniqueArray(state, action) {
      const storeArray = JSON.parse(JSON.stringify(state.filterArray));
      const isExist = storeArray?.find(
        (item) => item?.attribute_value === action.payload.attribute_value
      );
      if (isExist) {
        state.filterArray = storeArray?.filter(
          (item) => item.attribute_value !== isExist.attribute_value
        );
      } else {
        state.filterArray.push(action.payload);
      }

      const newArray = JSON.parse(JSON.stringify(state.filterArray));
      const queryString = newArray
        .map(
          (item) =>
            `attr_id[]=${item.id}&attribute_value[]=${item.attribute_value}`
        )
        .join("&");
      // let queryString = "";
      // newArray.forEach((item, index) => {
      //   queryString += `attr_id[]=${item.id}&attribute_value[]=${item.attribute_value}`;
      //   if (index !== newArray.length - 1) {
      //     queryString += "&";
      //   }
      // });
      state.filterQuery = queryString;
    },
    setFilterArray(state, action) {
      state.filterArray = action.payload;
    },
    setFilterQuery(state, action) {
      state.filterQuery = action.payload;
    },
    setProducts(state, action) {
      if (action.payload.length > 0) {
        state.products = [...state.products, ...action.payload];
      }
    },
    setClearProducts(state, action) {
      state.products = action.payload;
    },
    setFetchPermit(state, action) {
      state.fetchPermit = action.payload;
    },
    setSearchParams(state, action) {
      state.searchParams = action.payload;
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload;
    },
    setKeyword(state, action) {
      state.keyword = action.payload;
    },
    setTotal_page(state, action) {
      state.total_page = action.payload;
    },
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setSubCategoryId(state, action) {
      state.subCategoryId = action.payload;
    },
  },
});
export const productActions = productSlice.actions;

export const getproductList = (sub_cat_slug) => {
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  let page = 1;
  return async (dispatch) => {
    dispatch(productActions.setFilterQuery(""));
    dispatch(productActions.setFilterArray([]));
    dispatch(productActions.setSearchParams({}));
    dispatch(
      productActions.updatePageNumber(
        { slug: sub_cat_slug, user_id: user_id, page: page },
        { loaderStatus: false }
      )
    );
    dispatch(productActions.updateLoaderStatus(true));
    try {
      await mgtApi
        .post("/product-by-subcategory-web", {
          slug: sub_cat_slug,
          user_id: user_id,
          page: page,
        })
        .then((res) => {
          if (res.data.status === "success") {
            dispatch(productActions.setTotal_page(res?.data?.total_pages));
            dispatch(
              productActions.setClearProducts(res?.data?.data?.products)
            );
            dispatch(productActions.setFetchPermit(true));
            dispatch(productActions.productlistsbySubcatSuccess(res.data));
          }
        });
    } catch (e) {
      return;
    }
    dispatch(productActions.updateLoaderStatus(false));
  };
};

export const getSingleProductDetail = (payload) => {
  const prodSlug = payload.prodSlug;
  // console.log("title : ", payload);

  return async (dispatch) => {
    dispatch(productActions.updateLoaderStatus(true));
    try {
      const res = await mgtApi.get("/single-products/" + payload);

      if (res.data.status === "success") {
        // console.log("single product: 😍 ", res.data.data);
        dispatch(productActions.singleProductDetailSuccess(res.data.data));
      }

      dispatch(productActions.updateLoaderStatus(false));
    } catch (e) {
      // console.log("Error while getting single Product: ", e);
    }
  };
};

export const getFilterProducts = (
  keyword,
  minPrice,
  maxPrice,
  categoryId,
  subCategoryId,
  filterQuery
) => {
  return async (dispatch) => {
    dispatch(productActions.updateLoaderStatus(true));
    try {
      const res = await mgtApi.post(
        `/productsearch?${
          keyword && `keyword=${keyword}`
        }&price_between=${minPrice},${maxPrice}&page=1${
          categoryId && `&category_id=${categoryId}`
        }${subCategoryId && `&subcategory_id=${subCategoryId}`}${
          filterQuery && `&${filterQuery}`
        }`
      );

      dispatch(productActions.setClearProducts(res.data?.products));
      dispatch(productActions.setTotal_page(res.data.total_page));
      dispatch(productActions.updateLoaderStatus(false));
    } catch (e) {}
  };
};

export const getProductByCategory = (payload) => {
  const slug = payload;
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  let page = 1;
  return async (dispatch) => {
    dispatch(productActions.setFilterQuery(""));
    dispatch(productActions.setFilterArray([]));
    dispatch(productActions.setSearchParams({}));
    dispatch(
      productActions.updatePageNumber({
        slug: slug,
        user_id: user_id,
        page: page,
      })
    );
    dispatch(productActions.updateLoaderStatus(true));
    try {
      await mgtApi
        .post(
          "/product-by-category-web",
          { slug: slug, user_id: user_id, page: page },
          { loaderStatus: false }
        )
        .then((res) => {
          if (res.data.status === "success") {
            dispatch(productActions.setTotal_page(res?.data?.total_pages));
            dispatch(productActions.setFetchPermit(true));
            dispatch(productActions.setClearProducts(res.data?.data?.products));
            dispatch(productActions.productByCategorySuccess(res.data, page));
            let catId = res.data.data.product["0"].cate_id;
            dispatch(productActions.productByCategorycount(res.data.msg));
            dispatch(productActions.category_id(catId));
            dispatch(productActions.updateLoaderStatus(false));
          }
          if (res.data.status === "fail") {
            dispatch(productActions.productByCategoryFailure(res.data.msg));
            dispatch(productActions.updateLoaderStatus(false));
          }
        });
    } catch (e) {}
    dispatch(productActions.updateLoaderStatus(false));
  };
};

export const getFiltercode = (payload) => {
  return async (dispatch) => {
    let category_id = payload.cate_id;
    dispatch(productActions.setCategoryId(payload.cate_id));
    try {
      await mgtApi
        .post("/get-filter-options", { category_id: category_id })
        .then((res) => {
          if (res.data.status === "ok") {
            dispatch(productActions.filterListsSuccess(res.data));
            dispatch(productActions.bead_filter(res.data.filter["0"]));
          }

          if (res.data.status === "error") {
            dispatch(productActions.filterListsFailure(res.data.msg));
          }
        });
    } catch {}
  };
};
// export const getProductVariation = (payload) => {
//   return async (dispatch) => {
//     let product_id = payload.product_id; //alert(category_id);
//     try {
//       await mgtApi
//         .post("/product-variations", { product_id: product_id })
//         .then((res) => {
//           if (res.data.status === "ok") {
//             if (res.data.variation) {
//               dispatch(productActions.product_variationsList_success(res.data));
//             } else {
//               dispatch(productActions.product_variationsList_failure(res.data));
//             }
//           } else {
//             dispatch(productActions.product_variationsList_failure("Failed"));
//           }
//         });
//     } catch { }
//   };
// };

export const getFilterProduct = (payload, page = "") => {
  return async (dispatch) => {
    let userDetails = localStorage.getItem("userDetails");
    let data = JSON.parse(userDetails);
    let user_id = data?.ID;
    let custom_attributes = JSON.stringify(payload.beadCheckboxState);
    custom_attributes = custom_attributes.replace(
      /([a-zA-Z0-9-]+):([a-zA-Z0-9-]+)/g,
      '"$1":"$2"'
    );
    let slug = "";
    // let page = '';
    ////consolelog('custom_attributes',custom_attributes);
    try {
      // await mgtApi.post('/filter-product', { user_id: user_id, custom_attributes: custom_attributes }).then(res => {
      await mgtApi
        .post("/filter-product-web", {
          user_id: user_id,
          custom_attributes: custom_attributes,
          page: page,
        })
        .then((res) => {
          if (res.data.status == "success") {
            dispatch(
              productActions.updateBeadCheckboxFilterSuccess(
                payload.beadCheckboxState
              )
            );
            dispatch(productActions.filterProducts(res.data));
            dispatch(
              productActions.updatePageNumber({
                slug: slug,
                user_id: user_id,
                page: page,
              })
            );
          }
        });
    } catch {}
  };
};
export const pagination_product_bycategory = (slug, user_id, page) => {
  return async (dispatch) => {
    dispatch(
      productActions.updatePageNumber({
        slug: slug,
        user_id: user_id,
        page: page,
      })
    );
    try {
      await mgtApi
        .post("/product-by-category-web", {
          slug: slug,
          user_id: user_id,
          page: page,
        })
        .then((res) => {
          if (res.data.status == "success") {
            // dispatch(productActions.updateBeadCheckboxFilterSuccess([]))
            dispatch(productActions.productByCategorySuccess(res.data, page));
            let catId = res.data.data.products["0"].cate_id;
            dispatch(productActions.productByCategorycount(res.data.msg));
            dispatch(productActions.category_id(catId));
            dispatch(
              productActions.updatePageNumber({
                slug: slug,
                user_id: user_id,
                page: page,
              })
            );
          } else {
            // window.location.href="http://localhost:3000/page-not-found";
          }
        });
    } catch (e) {}
  };
};
export const pagination_product_by_subcategory = (slug, user_id, page) => {
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let userId = data?.ID;

  return async (dispatch) => {
    try {
      await mgtApi
        .post("/product-by-subcategory-web", {
          slug: slug,
          user_id: user_id,
          page: page,
        })
        .then((res) => {
          if (res.data.status === "success") {
            dispatch(
              productActions.productlistsbySubcatSuccess(res.data, page)
            );

            dispatch(
              productActions.updatePageNumber({
                slug: slug,
                user_id: user_id,
                page: page,
              })
            );
          } else {
            // window.location.href="http://localhost:3000/page-not-found";
          }
        });
    } catch (e) {}
  };
};
export const getRelatedProducts = (product_id, subcat_id, user_id) => {
  return async (dispatch) => {
    try {
      const res = await mgtApi.post("/related-products-web", {
        user_id: user_id,
        product_id: product_id,
        subcategory_id: subcat_id,
      });

      if (res.data.status === "ok") {
        dispatch(productActions.relatedProducts(res.data));
      }
    } catch (e) {
      // console.log("Error while getting RelatedProducts: ", e);
    }
  };
};

export function getVendorInfo(store_slug, page_Id = 1, query = "") {
  //  vendor_id,shipping_profile
  return async function (dispatch) {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    dispatch(productActions.updateLoaderStatus(true));
    try {
      const response = await mgtApi.get(`/vendor-info-store/${store_slug}`, {
        params: {
          page: page_Id,
          search_query: query,
        },
      });
      if (response.data.status === "ok") {
        dispatch(productActions.vendorInfoSuccess(response.data));
      }

      dispatch(productActions.updateLoaderStatus(false));
    } catch (error) {
      dispatch(productActions.updateLoaderStatus(false));
    }
  };
}

export function clearFilterArray() {
  //  ////consolelog('reducer',vendorid);
  return async function (dispatch) {
    try {
      dispatch(productActions.clearFilter());
    } catch (error) {
      ////consoleerror(error);
    }
  };
}

export function addWishlist(product_id) {
  //  ////consolelog('reducer',vendorid);
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  return async function (dispatch) {
    try {
      const response = await mgtApi.post("/addwishlist", {
        product_id: product_id,
        user_id: user_id,
      });
      dispatch(getHeaderData({ user_id: user_id }));
      dispatch(getWishlistProduct());
      if (response.data.wishlist_status === 1) {
        // console.log("added to wishlist: ", response.data);
        dispatch(productActions.wishAddSuccess(response.data.wishlist_status));
      } else {
        dispatch(
          productActions.wishRemoveSuccess(response.data.wishlist_status)
        );
      }
    } catch (error) {
      dispatch(productActions.wishAddFailure("Error Occured"));
      ////consoleerror(error);
    }
  };
}

export const getWishlistProduct = (payload) => {
  let userDetails = localStorage.getItem("userDetails");
  let data = JSON.parse(userDetails);
  let user_id = data?.ID;
  return async (dispatch) => {
    // dispatch(loaderStart());
    try {
      const response = await mgtApi.post("/user-wishlist", {
        user_id: user_id,
      });
      // console.log(response.data)
      if (response.data.status === 1) {
        dispatch(productActions.fetchWishlist(response.data));
        dispatch(productActions.wishAddSuccess(1));
        dispatch(loaderStop());
      } else {
        dispatch(loaderStop());
      }
    } catch (error) {
      ////consoleerror(error);
    }
  };
};

export const getProductCartCount = (user_id, product_id) => {
  return async (dispatch) => {
    // dispatch(loaderStart());
    try {
      const response = await mgtApi.post("/user-check-prod-qty", {
        user_id: user_id,
        product_id: product_id,
      });
      //consolelog("cart count response", response.data);
      if (response.data.status === "ok") {
        dispatch(
          productActions.userCartProductCount(response.data.avail_product_qty)
        );
        // dispatch(productActions.wishAddSuccess(1));
        // dispatch(loaderStop());
      } else {
        // dispatch(loaderStop());
      }
    } catch (error) {
      ////consoleerror(error);
    }
  };
};

export const loaderStart = () => {
  return async (dispatch) => {
    dispatch(productActions.updateLoaderStatus(true));
  };
};

export const loaderStop = () => {
  return async (dispatch) => {
    dispatch(productActions.updateLoaderStatus(false));
  };
};

export const getAutosuggestion_List = (keyword) => {
  return async (dispatch) => {
    try {
      const response = await mgtApi.post("/search-product", {
        keyword: keyword,
      });
      if (response.data.status == "success") {
        dispatch(
          productActions.fetch_suggestList_product(response.data.products)
        );
      }
    } catch (error) {
      ////consoleerror(error);
    }
  };
};

export default productSlice.reducer;
