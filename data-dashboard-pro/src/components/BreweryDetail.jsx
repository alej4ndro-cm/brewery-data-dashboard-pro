// src/components/BreweryDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

function BreweryDetail() {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [nearbyBreweries, setNearbyBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(true);
  const [chartType, setChartType] = useState("bar"); // New state for chart type

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const res = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        const data = await res.json();
        setBrewery(data);
        setLoading(false);
        
        // After getting brewery details, fetch nearby breweries if city and state exist
        if (data && data.city && data.state) {
          fetchNearbyBreweries(data.city, data.state);
        } else {
          setLoadingNearby(false);
        }
      } catch (err) {
        console.error("Error fetching brewery:", err);
        setLoading(false);
        setLoadingNearby(false);
      }
    };

    fetchBrewery();
  }, [id]);

  // Toggle chart type function
  const toggleChartType = () => {
    setChartType(chartType === "bar" ? "pie" : "bar");
  };

  const fetchNearbyBreweries = async (city, state) => {
    try {
      const res = await fetch(
        `https://api.openbrewerydb.org/v1/breweries?by_city=${encodeURIComponent(city)}&by_state=${encodeURIComponent(state)}&per_page=10`
      );
      const data = await res.json();
      // Filter out the current brewery
      setNearbyBreweries(data.filter(b => b.id !== id));
      setLoadingNearby(false);
    } catch (err) {
      console.error("Error fetching nearby breweries:", err);
      setLoadingNearby(false);
    }
  };

  // Format phone number with dashes if it exists
  const formatPhone = (phone) => {
    if (!phone) return "Not available";
    
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");
    
    // Format as XXX-XXX-XXXX if 10 digits
    if (digitsOnly.length === 10) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    }
    
    return phone;
  };

  // Prepare data for brewery type comparison
  const getTypeComparisonData = () => {
    if (!brewery || !nearbyBreweries.length) return [];
    
    const types = {};
    
    // Count nearby brewery types
    nearbyBreweries.forEach(b => {
      if (b.brewery_type) {
        types[b.brewery_type] = (types[b.brewery_type] || 0) + 1;
      }
    });
    
    // Convert to array format for chart
    return Object.entries(types).map(([type, count]) => ({
      type,
      count,
      isCurrentBrewery: type === brewery.brewery_type
    }));
  };

  // Render chart based on selected type
  const renderTypeComparisonChart = () => {
    const data = getTypeComparisonData();
    
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="type" 
              stroke="#fff" 
              tick={{ fill: '#fff' }} 
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff' }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 94, 54, 0.3)' }}  // Semi-transparent orange/red instead of gray
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                color: '#333',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }} 
            />
            <Legend 
              wrapperStyle={{ color: '#fff' }} 
            />
            <Bar
              dataKey="count" 
              name="Number of breweries"
              fill="#FF5A36"
              strokeWidth={0}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                color: '#333',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  // Colors for charts
  const COLORS = ["#ff7e5f", "#feb47b", "#ffd166", "#06d6a0", "#118ab2"];

  if (loading) return <p className="loading-message">Loading brewery details...</p>;

  if (!brewery || brewery.message === "Not Found") {
    return (
      <div className="detail-container">
        <h2>Brewery not found</h2>
        <p>Sorry, we couldn't find information for this brewery.</p>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <h1>{brewery.name}</h1>
        <span className="brewery-type-badge">{brewery.brewery_type}</span>
      </header>

      <div className="detail-content">
        <section className="detail-section">
          <h2>Brewery Information</h2>
          
          <div className="info-grid">
            <div className="info-card">
              <h3>Location</h3>
              <p>{brewery.street || 'Address not available'}</p>
              <p>{brewery.city}, {brewery.state} {brewery.postal_code}</p>
              <p>{brewery.country}</p>
              
              {brewery.latitude && brewery.longitude && (
                <div className="map-placeholder">
                  <p>
                    Coordinates: {parseFloat(brewery.latitude).toFixed(4)}°N, {parseFloat(brewery.longitude).toFixed(4)}°W
                  </p>
                  <p>
                    <a 
                      href={`https://www.google.com/maps?q=${brewery.latitude},${brewery.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="maps-link"
                    >
                      View on Google Maps
                    </a>
                  </p>
                </div>
              )}
            </div>
            
            <div className="info-card">
              <h3>Contact Information</h3>
              <p><strong>Phone:</strong> {formatPhone(brewery.phone)}</p>
              {brewery.website_url && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={brewery.website_url} target="_blank" rel="noopener noreferrer" className="website-link">
                    {brewery.website_url}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="detail-section">
          <h2>Brewery Details</h2>
          <div className="additional-details">
            <p>
              <strong>{brewery.name}</strong> is a {brewery.brewery_type} brewery located in {brewery.city}, {brewery.state}.
              {brewery.brewery_type === "micro" && " Microbreweries are small breweries that typically produce specialty beers in limited quantities."}
              {brewery.brewery_type === "brewpub" && " Brewpubs combine a brewery with a restaurant, serving beer produced on the premises."}
              {brewery.brewery_type === "regional" && " Regional breweries are mid-sized breweries that distribute within a specific region."}
              {brewery.brewery_type === "large" && " Large breweries have significant production and wide distribution networks."}
            </p>
            
            {brewery.website_url && (
              <p>
                Visit their website at <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a> to learn more about their beer selection and business hours.
              </p>
            )}
          </div>
        </section>

        <section className="detail-section">
          <h2>Nearby Breweries in {brewery.city}</h2>
          {loadingNearby ? (
            <p>Finding nearby breweries...</p>
          ) : nearbyBreweries.length > 0 ? (
            <>
              <div className="nearby-breweries-list">
                {nearbyBreweries.map(nearby => (
                  <div key={nearby.id} className="nearby-brewery-card">
                    <Link to={`/brewery/${nearby.id}`} className="nearby-brewery-link">
                      <h3>{nearby.name}</h3>
                    </Link>
                    <p>Type: {nearby.brewery_type}</p>
                    <p>{nearby.street}</p>
                    {nearby.website_url && (
                      <a href={nearby.website_url} target="_blank" rel="noopener noreferrer" className="website-link">
                        Visit Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
              
              {getTypeComparisonData().length > 0 && (
                <div className="chart-container" style={{ backgroundColor: 'rgba(30, 30, 30, 0.9)' }}>
                  <h3>Brewery Types in {brewery.city}</h3>
                  <p className="chart-description">
                    This chart shows the different types of breweries found in {brewery.city}. {brewery.name} is highlighted.
                  </p>
                  
                  {/* Chart toggle button */}
                  <button 
                    className="chart-type-toggle" 
                    onClick={toggleChartType}
                  >
                    Switch to {chartType === "bar" ? "Pie" : "Bar"} Chart
                  </button>
                  
                  {/* Render chart based on selected type */}
                  {renderTypeComparisonChart()}
                </div>
              )}
            </>
          ) : (
            <p>No other breweries found in {brewery.city}, {brewery.state}.</p>
          )}
        </section>
      </div>

      <Link to="/" className="back-link">← Back to Dashboard</Link>
    </div>
  );
}

export default BreweryDetail;