import React, { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import styles from './homepage.module.css';

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag]);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.heroShape + ' ' + styles.heroShape1} />
        <div className={styles.heroShape + ' ' + styles.heroShape2} />
        <div className={styles.heroShape + ' ' + styles.heroShape3} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Now Serving</span>
          <h1 className={styles.heroTitle}>
            Taste the <span className={styles.heroHighlight}>Finest</span>{' '}
            Flavors
          </h1>
          <p className={styles.heroSubtitle}>
            Discover an unforgettable dining experience with handcrafted dishes
            made from the freshest ingredients. Your perfect meal is just a
            click away.
          </p>
          <div className={styles.heroActions}>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                const el = document.getElementById('menu-preview');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Our Menu &rarr;
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <div className={styles.statsBanner}>
        <div className={styles.statItem}>
          <p className={styles.statNumber}>50+</p>
          <p className={styles.statLabel}>Menu Items</p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statNumber}>1000+</p>
          <p className={styles.statLabel}>Happy Customers</p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statNumber}>30 min</p>
          <p className={styles.statLabel}>Avg. Delivery</p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statNumber}>4.9 ★</p>
          <p className={styles.statLabel}>Customer Rating</p>
        </div>
      </div>

      {/* ===== SEARCH SECTION ===== */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Find Your Dish</span>
            <h2 className={styles.sectionTitle}>What are you craving?</h2>
            <p className={styles.sectionSubtitle}>
              Search from our wide variety of delicious meals
            </p>
          </div>
          <Search margin="0 auto" />
        </div>
      </div>

      {/* ===== CATEGORIES SECTION ===== */}
      {tags.length > 0 && (
        <div className={styles.categoriesSection}>
          <h3 className={styles.categoriesTitle}>Browse by Category</h3>
          <Tags tags={tags} />
        </div>
      )}

      {/* ===== MENU PREVIEW ===== */}
      <div id="menu-preview" className={styles.menuSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Our Menu</span>
          <h2 className={styles.sectionTitle}>Popular Dishes</h2>
          <p className={styles.sectionSubtitle}>
            Explore our most loved meals crafted with passion
          </p>
        </div>
        {foods.length === 0 ? <NotFound /> : <Thumbnails foods={foods} />}
      </div>

      {/* ===== CTA SECTION ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Get Started</span>
            <h2 className={[styles.sectionTitle, styles.sectionTitleLight].join(' ')}>
              Ready to Order?
            </h2>
          </div>
          <p className={styles.ctaText}>
            Join KETI RESTAURANT today and enjoy exclusive deals, faster
            checkout, and a seamless dining experience from the comfort of your
            home.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.ctaButton}>
              Create an Account &rarr;
            </Link>
            <Link to="/cart" className={styles.btnSecondary}>
              View Cart
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <p className={styles.footerBrand}>&copy; 2026 KETI RESTAURANT</p>
        <p>Delicious food, delivered with care.</p>
      </footer>
    </>
  );
}