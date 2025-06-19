import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../redux/productSlice'; // adjust path as needed
import '../styles/components/Products.css';
import SpecialProduct from '../components/SpecialProduct';
import Instagram from '../components/InstagramSection';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: allProducts, loading, error } = useSelector((state) => state.product);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]);
  const [totalPages, setTotalPages] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    dispatch(getProducts({ page: 1, limit: 10 })); 
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length > 0) {
      paginate(currentPage, allProducts);
    }
  }, [allProducts]);

  const paginate = (page, productList = allProducts) => {
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    setProducts(productList.slice(start, end));
    setCurrentPage(page);
    setTotalPages(Math.ceil(productList.length / PRODUCTS_PER_PAGE));

    const maxVisible = 3;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    setVisiblePages(Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
  };

  const filterProducts = (type, value) => {
    let filtered = [...allProducts];

    if (type === 'color') {
      filtered = filtered.filter(p => p.colors?.includes(value));
    } else if (type === 'price') {
      const [min, max] = value.match(/\d+/g).map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    } else if (type === 'tag') {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(value.toLowerCase()));
    } else if (type === 'collection') {
      filtered = value === 'All' ? allProducts : filtered.filter(p => p.category?.toLowerCase().includes(value.toLowerCase()));
    }

    setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
    paginate(1, filtered);
  };

const handleSearch = (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(keyword) // ✅ Use `.name` instead of `.title`
  );
  paginate(1, filtered);
};

  return (
    <>
      <div className="products-page1">
        {/* Sidebar Filters */}
        <div className="sidebar1">
          <h2 className='side'>Filters</h2>
          <div className="filter-section1">
            <h4 className='a'>Colors</h4>
            <ul className="color-list1">
              {['#fff', '#000', '#003366'].map(color => (
                <li key={color}>
                  <span className="color-box1" style={{ backgroundColor: color }} onClick={() => filterProducts('color', color)} />
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section1">
            <h4 className='a'>Prices</h4>
            <ul className="button-list1">
              {['₹0 – ₹50', '₹50 – ₹100', '₹100 – ₹150'].map(price => (
                <li key={price}>
                  <button onClick={() => filterProducts('price', price)}>{price}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section1">
            <h4 className='a'>Tags</h4>
            <ul className="button-list1">
              {['Shirt', 'Hat', 'T-Shirt'].map(tag => (
                <li key={tag}>
                  <button onClick={() => filterProducts('tag', tag)}>{tag}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section1">
            <h4 className='a'>Collections</h4>
            <ul className="button-list1">
              {['All', "Men's clothing", "Women's clothing", "Jewelery"].map(c => (
                <li key={c}>
                  <button onClick={() => filterProducts('collection', c)}>{c}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Filters Toggle */}
        <div className="mobile-filter-toggle">
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="mobile-filter-button">
            {showMobileFilters ? 'Close Filters ✖' : 'Show Filters ☰'}
          </button>
        </div>

        {showMobileFilters && (
          <div className="mobile-filter-panel">
            {/* same filters as sidebar */}
          </div>
        )}

        {/* Products Grid */}
        <div className="products-main1">
          <div className="products-header">
            <div className="top-bar">
              <div className="top-header">
                <h1 className="products-title">Products</h1>
                <div className="breadcrumb1">
                  <Link to="/" className="breadcrumb-link">Home</Link> &gt; Products
                </div>
              </div>

              <div className="search-wrapper">
                <button className="search-icon" onClick={() => setShowSearch(!showSearch)}>
                  <i className="fas fa-search"></i>
                </button>
                {showSearch && (
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar"
                    onChange={handleSearch}
                  />
                )}
              </div>
            </div>
          </div>

{loading ? (
  <p>Loading products...</p>
) : error ? (
  <p style={{ color: 'red' }}>Error: {error}</p>
) : (
  <div className="product-grid1">
    {products.map(product => (
      <div
        className="product-card1 fade-in"
        key={product._id}
        onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
      >
        <div className="product-image-wrapper">
          <img src={product.images[0]} alt={product.name} />
          {product.soldOut && <div className="sold-out">Sold Out</div>}
        </div>
        <h3>{product.name}</h3>
        <p>
          <span className="price1">₹{product.price?.toFixed(2)}</span>
        </p>
        {product.colors && (
          <div className="color-options1">
            {product.colors.map((color, i) => (
              <span key={i} className="color-dot1" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
)}


          {/* Pagination */}
          <div className="pagination1">
            <ul className="pagination-ul1">
              {visiblePages[0] > 1 && <li><button className="page-btn1" onClick={() => paginate(currentPage - 1)}>«</button></li>}
              {visiblePages.map(num => (
                <li key={num}>
                  <button className={num === currentPage ? 'active-page1' : 'page-btn1'} onClick={() => paginate(num)}>{num}</button>
                </li>
              ))}
              {visiblePages[visiblePages.length - 1] < totalPages && <li><button className="page-btn1" onClick={() => paginate(currentPage + 1)}>»</button></li>}
            </ul>
          </div>
        </div>
      </div>

      <SpecialProduct />
      <Instagram />
    </>
  );
};

export default Products;
