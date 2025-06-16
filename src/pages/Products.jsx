import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components/Products.css';
import product1 from '../assets/products/product1.png';
import product2 from '../assets/products/product2.jpg';
import product3 from '../assets/products/product3.jpg';
import product4 from '../assets/products/product4.png';
import product5 from '../assets/products/product5.png';
import product6 from '../assets/products/product6.png';
import product7 from '../assets/products/product7.png';
import product8 from '../assets/products/product8.jpg';
import product9 from '../assets/products/product9.jpg';
import SpecialProduct from '../components/SpecialProduct';
import Instagram from '../components/InstagramSection';

const productData = [
  {
    id: 1,
    name: 'Boxy Denim Hat',
    price: '₹1091.00',
    originalPrice: '₹1141.00',
    colors: ['#000'],
    image: product1
  },
  {
    id: 2,
    name: 'Linen Plain Top',
    price: '₹1091.00',
    originalPrice: '₹1141.00',
    colors: ['#e1e1e1', '#222'],
    image: product2
  },
  {
    id: 3,
    name: 'Oversized T-shirt',
    price: '₹1091.00',
    originalPrice: '₹1141.00',
    colors: ['#000', '#003366', '#222'],
    image: product3
  },
  {
    id: 4,
    name: 'Rounded Red Hat',
    price: '₹800.00',
    originalPrice: '',
    colors: ['#000'],
    image: product4
  },
  {
    id: 5,
    name: 'Linen-blend Shirt',
    price: '₹1720.00',
    originalPrice: '',
    colors: ['#000', '#fff'],
    image: product5
  },
  {
    id: 6,
    name: 'Long sleeve Coat',
    price: '₹1600.00',
    originalPrice: '',
    colors: ['#fff'],
    image: product6
  },
  {
    id: 7,
    name: 'Basic White Shirt',
    price: '₹1091.00',
    originalPrice: '₹1141.00',
    colors: ['#e1e1e1'],
    image: product7
  },
  {
    id: 8,
    name: 'Rockstar Jacket',
    price: '₹1091.00',
    originalPrice: '₹1141.00',
    colors: ['#ccc', '#000'],
    image: product8
  },
  {
    id: 9,
    name: 'Dotted Black Dress',
    price: '₹1091.00',
    originalPrice: '₹1141.00',
    colors: ['#000', '#333', '#666'],
    image: product9
  }
];

const getRandomSoldOutStatus = () => Math.random() < 0.3;

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Set actual total pages dynamically if needed
  const [visiblePages, setVisiblePages] = useState([1, 2, 3]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const updated = productData.map(item => ({
      ...item,
      soldOut: getRandomSoldOutStatus()
    }));
    setProducts(updated);
    setAllProducts(updated);
  }, []);

  const shuffleProducts = () => {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    setProducts(shuffled.slice(0, Math.floor(Math.random() * allProducts.length)));
  };

  const handleFilter = (type, value) => {
    if (type === 'collection' && value === 'All products') {
      setProducts(allProducts);
    } else {
      shuffleProducts();
    }
  };

  const goToPage = (page) => {
  setCurrentPage(page);

  const maxVisible = 3;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - maxVisible + 1;
    if (start < 1) start = 1;
  }

  const updatedPages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  setVisiblePages(updatedPages);

  shuffleProducts(); // If you want products to change with pagination
};

const nextPage = () => {
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
};

  return (
    <>
      <div className="products-page1">
        {/* Sidebar */}
        <div className="sidebar1">
          <h2 className='side'>Filters</h2>
          {/* Repeat filter sections as in your current code */}
          <div className="filter-section1">
            <h4 className='a'>Size</h4>
            <ul className="button-list1">
              {['S', 'M', 'L', 'XL'].map(size => (
                <li key={size}>
                  <button onClick={() => handleFilter('size', size)}>{size}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-section1">
            <h4 className='a'>Colors</h4>
            <ul className="color-list1">
              {['#fff', '#000', '#003366'].map(color => (
                <li key={color}>
                  <span
                    className="color-box1"
                    style={{ backgroundColor: color }}
                    onClick={() => handleFilter('color', color)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-section1">
            <h4 className='a'>Prices</h4>
            <ul className="button-list1">
              {['₹0 – ₹50', '₹50 – ₹100', '₹100 – ₹150', '₹150 – ₹220', '₹300 – ₹400'].map(price => (
                <li key={price}>
                  <button onClick={() => handleFilter('price', price)}>{price}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-section1">
            <h4 className='a'>Collections</h4>
            <ul className="button-list1">
              {['All products', 'Best sellers', 'New arrivals', 'Accessories'].map(collection => (
                <li key={collection}>
                  <button onClick={() => handleFilter('collection', collection)}>{collection}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-section1">
            <h4 className='a'>Tags</h4>
            <ul className="button-list1">
              {['Shirts', 'Hats', 'T-Shirts', 'Pants', 'Sunglasses'].map(tag => (
                <li key={tag}>
                  <button onClick={() => handleFilter('tag', tag)}>{tag}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="products-main1">
          {/* Header */}
          <div className="products-header">
            <div className="top-bar">
              <div className="top-header">
                <h1 className="products-title">Products</h1>
                <div className="breadcrumb1">
                  <Link to="/" className="breadcrumb-link">Home</Link> &gt; Products
                </div>
              </div>
              <div className="search-wrapper">
                <button
                  className="search-icon"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Toggle search"
                >
                  <i className="fas fa-search"></i>
                </button>
                {showSearch && (
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="search-bar"
                    onChange={(e) => {
                      const term = e.target.value.toLowerCase();
                      const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
                      setProducts(filtered);
                    }}
                  />
                )}
              </div>
            </div>

          </div>

          {/* Mobile Filters Toggle */}
          <div className="mobile-filter-toggle">
            <button className="mobile-filter-button" onClick={() => setShowMobileFilters(true)}>Filters</button>
          </div>

          {showMobileFilters && (
           <div className="mobile-filters-panel">
             <button className="close-btn" onClick={() => setShowMobileFilters(false)}>×</button>

             <div className="filter-section1">
               <h4 className='a'>Size</h4>
               <ul className="button-list1">
                 {['S', 'M', 'L', 'XL'].map(size => (
                   <li key={size}>
                     <button onClick={() => { handleFilter('size', size); setShowMobileFilters(false); }}>{size}</button>
                   </li>
                 ))}
               </ul>
             </div>

             <div className="filter-section1">
               <h4 className='a'>Colors</h4>
               <ul className="color-list1">
                 {['#fff', '#000', '#003366'].map(color => (
                   <li key={color}>
                     <span
                       className="color-box1"
                       style={{ backgroundColor: color }}
                       onClick={() => { handleFilter('color', color); setShowMobileFilters(false); }}
                     />
                   </li>
                 ))}
               </ul>
             </div>

             <div className="filter-section1">
               <h4 className='a'>Prices</h4>
               <ul className="button-list1">
                {['₹0 – ₹50', '₹50 – ₹100', '₹100 – ₹150', '₹150 – ₹220', '₹300 – ₹400'].map(price => (
                          <li key={price}>
                     <button onClick={() => { handleFilter('price', price); setShowMobileFilters(false); }}>{price}</button>
                   </li>
                 ))}
               </ul>
             </div>

             <div className="filter-section1">
               <h4 className='a'>Collections</h4>
               <ul className="button-list1">
                 {['All products', 'Best sellers', 'New arrivals', 'Accessories'].map(collection => (
                   <li key={collection}>
                     <button onClick={() => { handleFilter('collection', collection); setShowMobileFilters(false); }}>{collection}</button>
                   </li>
                 ))}
               </ul>
             </div>

            <div className="filter-section1">
               <h4 className='a'>Tags</h4>
               <ul className="button-list1">
                 {['Shirts', 'Hats', 'T-Shirts', 'Pants', 'Sunglasses'].map(tag => (
                   <li key={tag}>
                     <button onClick={() => { handleFilter('tag', tag); setShowMobileFilters(false); }}>{tag}</button>
                   </li>
                 ))}
               </ul>
             </div>
           </div>
         )}


          {/* Products Grid */}
          <div className="product-grid1">
            {products.map((product) => (
              <div
                className="product-card1 fade-in"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
              >
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} />
                  {product.soldOut && <div className="sold-out">Sold Out</div>}
                </div>
                <h3>{product.name}</h3>
                <p>
                  <span className="price1">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price1">{product.originalPrice}</span>
                  )}
                </p>
                <div className="color-options1">
                  {product.colors.map((color, i) => (
                    <span
                      key={i}
                      className="color-dot1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination1">
            <ul className="pagination-ul1">
              {visiblePages[0] > 1 && (
                <li>
                  <button className="page-btn1" onClick={prevPage}>«</button>
                </li>
              )}

              {visiblePages.map(num => (
                <li key={num}>
                  <button
                    className={num === currentPage ? 'active-page1' : 'page-btn1'}
                    onClick={() => goToPage(num)}
                  >
                    {num}
                  </button>
                </li>
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <li>
                  <button className="page-btn1" onClick={nextPage}>»</button>
                </li>
              )}
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
