import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as regularThumb } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumb } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState({});
  const [likedPhotos, setLikedPhotos] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(1);
  const loaderRef = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchPhotos = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${pageRef.current}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch photos");
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        hasMoreRef.current = false;
        setHasMore(false);
        return;
      }

      setPhotos((previous) => {
        const existingIds = new Set(previous.map((photo) => photo.id));
        const newPhotos = data.filter(
          (photo) => !existingIds.has(photo.id)
        );
        return [...previous, ...newPhotos];
      });

      pageRef.current += 1;
    } catch (err) {
      setError("Something went wrong while loading photos.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPhotos();
        }
      },
      { threshold: 0.1 }
    );

    const element = loaderRef.current;

    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [fetchPhotos]);

  const handleLike = (id) => {
    setLikes((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1,
    }));

    setLikedPhotos((previous) => ({
      ...previous,
      [id]: true,
    }));
  };

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <span className="eyebrow">THE VISUAL COLLECTION</span>
          <h1>Photo Gallery<span>.</span></h1>
          <p>A collection of moments captured around the world.</p>

          <div className="gallery-stats">
            <span>{photos.length} photos discovered</span>
            <span className="live-dot"></span>
            <span>Live collection</span>
          </div>
        </div>
      </header>

      <main className="gallery-section">
        <div className="gallery-toolbar">
          <div>
            <h2>Explore photographs</h2>
            <p>Discover stories through every frame.</p>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="gallery">
          {filteredPhotos.map((photo) => (
            <article className="photo-card" key={photo.id}>
              <div className="photo-image">
                <img
                  src={photo.download_url}
                  alt={`Photograph by ${photo.author}`}
                  loading="lazy"
                />
              </div>

              <div className="photo-info">
                <div className="author-info">
                  <span className="photo-label">PHOTOGRAPHER</span>
                  <h3>Author: {photo.author}</h3>
                </div>

                <button
                  className={`like-button ${
                    likedPhotos[photo.id] ? "liked" : ""
                  }`}
                  onClick={() => handleLike(photo.id)}
                  aria-label={`Like photo by ${photo.author}`}
                >
                  <FontAwesomeIcon
                    icon={
                      likedPhotos[photo.id] ? solidThumb : regularThumb
                    }
                  />
                  <span>{likes[photo.id] || 0}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredPhotos.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No photographers found</h3>
            <p>Try searching with another author's name.</p>
          </div>
        )}

        <div ref={loaderRef} className="loader">
          {loading && <p>Discovering more photographs...</p>}

          {error && (
            <div>
              <p>{error}</p>
              <button onClick={fetchPhotos}>Try again</button>
            </div>
          )}

          {!hasMore && (
            <p>You've reached the end of the collection.</p>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>PHOTO GALLERY · A COLLECTION OF MOMENTS</p>
      </footer>
    </div>
  );
}

export default App;