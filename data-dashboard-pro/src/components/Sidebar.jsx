// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

function Sidebar({ 
  searchQuery, 
  handleSearch, 
  breweryType, 
  handleBreweryTypeChange, 
  selectedState, 
  handleStateChange,
  uniqueTypes,
  uniqueStates,
  breweries,
  filteredBreweries 
}) {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <Link to="/" className="sidebar-link">Dashboard Home</Link>
      
      <div className="sidebar-section">
        <h3>Search & Filters</h3>
        <input
          type="text"
          placeholder="Search breweries..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        
        <div className="filter-group">
          <label htmlFor="type-filter">Brewery Type:</label>
          <select 
            id="type-filter"
            value={breweryType} 
            onChange={handleBreweryTypeChange} 
            className="filter-dropdown"
          >
            <option value="">All Brewery Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="state-filter">State:</label>
          <select 
            id="state-filter"
            value={selectedState} 
            onChange={handleStateChange} 
            className="filter-dropdown"
          >
            <option value="">All States</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Statistics</h3>
        <p>Showing {filteredBreweries.length} of {breweries.length} breweries</p>
      </div>
    </div>
  );
}

export default Sidebar;