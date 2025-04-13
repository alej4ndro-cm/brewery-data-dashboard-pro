// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import BreweryDetail from "./components/BreweryDetail";
import Sidebar from "./components/Sidebar";
import "./App.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [breweryType, setBreweryType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showCharts, setShowCharts] = useState(true);
  const [chartType, setChartType] = useState("bar"); // New state for chart type toggle

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch("https://api.openbrewerydb.org/v1/breweries");
        const data = await response.json();
        setBreweries(data);
        setFilteredBreweries(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchBreweries();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchQuery, breweryType, selectedState, breweries]);

  const uniqueStates = [...new Set(breweries.map((b) => b.state).filter(Boolean))].sort();
  const uniqueTypes = [...new Set(breweries.map((b) => b.brewery_type).filter(Boolean))].sort();

  const handleFilter = () => {
    let filtered = breweries.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (breweryType) filtered = filtered.filter((b) => b.brewery_type === breweryType);
    if (selectedState) filtered = filtered.filter((b) => b.state === selectedState);
    setFilteredBreweries(filtered);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleBreweryTypeChange = (e) => setBreweryType(e.target.value);
  const handleStateChange = (e) => setSelectedState(e.target.value);
  
  // New function to toggle chart type
  const toggleChartType = () => {
    setChartType(chartType === "bar" ? "pie" : "bar");
  };

  const getMostCommonType = () => {
    const typeCounts = {};
    breweries.forEach((b) => {
      typeCounts[b.brewery_type] = (typeCounts[b.brewery_type] || 0) + 1;
    });
    return Object.entries(typeCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0] || "None";
  };

  const getAverageBreweriesPerState = () => {
    return uniqueStates.length === 0 ? 0 : (breweries.length / uniqueStates.length).toFixed(1);
  };

  const breweryTypeData = Object.entries(
    filteredBreweries.reduce((acc, b) => {
      acc[b.brewery_type] = (acc[b.brewery_type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ type, count }));

  const stateData = Object.entries(
    filteredBreweries.reduce((acc, b) => {
      acc[b.state] = (acc[b.state] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([state, count]) => ({ state, count }));

  // Adding a third visualization for when a state is selected
  const stateBreweryTypeData = selectedState
    ? Object.entries(
        breweries
          .filter(b => b.state === selectedState)
          .reduce((acc, b) => {
            if (b.brewery_type) {
              acc[b.brewery_type] = (acc[b.brewery_type] || 0) + 1;
            }
            return acc;
          }, {})
      ).map(([type, count]) => ({ type, count }))
    : [];

  const COLORS = ["#ff7e5f", "#feb47b", "#ffd166", "#06d6a0", "#118ab2"];

  // Render brewery type visualization based on selected chart type
  const renderBreweryTypeChart = () => {
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={breweryTypeData}>
            <XAxis dataKey="type" stroke="#fff" tick={{ fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 94, 54, 0.3)' }}  // Semi-transparent orange/red
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                color: '#333',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="count" fill="#feb47b" name="Number of breweries" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={breweryTypeData}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {breweryTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

  // Render state data visualization based on selected chart type
  const renderStateDataChart = () => {
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData}>
            <XAxis dataKey="state" stroke="#fff" tick={{ fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(6, 214, 160, 0.3)' }}  // Semi-transparent green
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                color: '#333',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="count" fill="#06d6a0" name="Number of breweries" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stateData}
              dataKey="count"
              nameKey="state"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {stateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  
  const renderStateBreweryTypeChart = () => {
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateBreweryTypeData}>
            <XAxis dataKey="type" stroke="#fff" tick={{ fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(136, 132, 216, 0.3)' }}  // Semi-transparent purple
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                color: '#333',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }} 
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="count" fill="#8884d8" name="Number of breweries" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stateBreweryTypeData}>
            <XAxis dataKey="type" stroke="#fff" tick={{ fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
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
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  // This is the main dashboard view
  const DashboardView = () => (
    <div className="container">
      <header className="header">
        <h1>Brewery Dashboard 🍺</h1>
        <p>Discover breweries across the US</p>
      </header>

      {loading ? (
        <p>Loading breweries...</p>
      ) : (
        <>
          <div className="dashboard-top">
            <div className="summary">
              <h2>Brewery Statistics</h2>
              <p>Total Breweries: {breweries.length}</p>
              <p>Most Common Type: {getMostCommonType()}</p>
              <p>Average Breweries per State: {getAverageBreweriesPerState()}</p>
            </div>

            {showCharts && (
              <div className="charts">
                <h2>Data Visualizations</h2>
                <p className="chart-description">
                  These charts help explore the brewery scene across the U.S. Try applying filters to see how brewery types and states are distributed!
                </p>

                {/* Chart toggle button - moved up here to affect all charts */}
                <button 
                  className="chart-type-toggle" 
                  onClick={toggleChartType}
                >
                  Switch to {chartType === "bar" ? "Pie" : "Bar"} Chart
                </button>

                <div className="chart-container">
                  <h3>Brewery Count by Type</h3>
                  <p className="chart-description">
                    This visualization shows which brewery types are most common.
                  </p>
                  
                  {/* Render chart based on selected type */}
                  {renderBreweryTypeChart()}
                </div>

                <div className="chart-container">
                  <h3>Top 5 States by Breweries</h3>
                  <p className="chart-description">
                    This chart shows which states have the most breweries.
                  </p>
                  {renderStateDataChart()}
                </div>

                {selectedState && stateBreweryTypeData.length > 0 && (
                  <div className="chart-container">
                    <h3>Brewery Types in {selectedState}</h3>
                    <p className="chart-description">
                      This chart shows the distribution of brewery types in {selectedState}.
                    </p>
                    {renderStateBreweryTypeChart()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="chart-toggle">
            <button onClick={() => setShowCharts(!showCharts)}>
              {showCharts ? "Hide Visualizations" : "Show Visualizations"}
            </button>
          </div>

          <ul className="brewery-list">
            {filteredBreweries.map((brewery) => (
              <li key={brewery.id} className="brewery-item">
                <Link to={`/brewery/${brewery.id}`}><strong>{brewery.name}</strong></Link>
                <p>{brewery.city}, {brewery.state || 'N/A'}</p>
                <p>Type: {brewery.brewery_type}</p>
                {brewery.website_url && (
                  <p><a href={brewery.website_url} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        breweryType={breweryType}
        handleBreweryTypeChange={handleBreweryTypeChange}
        selectedState={selectedState}
        handleStateChange={handleStateChange}
        uniqueTypes={uniqueTypes}
        uniqueStates={uniqueStates}
        breweries={breweries}
        filteredBreweries={filteredBreweries}
      />
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/brewery/:id" element={<BreweryDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;