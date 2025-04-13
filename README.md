# **Data Dashboard Pro – Brewery Insights**

This web app: **A professional-grade data dashboard that allows users to explore, visualize, and investigate breweries across the United States using the Open Brewery DB API. Features include interactive filters, dynamic routing with React Router, and multiple data visualizations (Bar, Pie, Line charts). Users can navigate to individual brewery detail pages with contextual insights, nearby brewery comparisons, and charts showing distribution by type and location.**

Time spent: **6–7 hours in total**

---

## **Goals Achieved**

By the end of this project, I was able to:

- **Implement dynamic routing using React Router v6**
- **Use `useParams()` to extract route parameters for detail views**
- **Use nested components for maintainable layout and routing structure**
- **Render Bar, Pie, and Line charts with Recharts using real API data**
- **Create a Sidebar for search, filters, and navigation**
- **Enhance UI consistency across views with shared layouts and themes**
- **Use conditional logic to fetch and display context-specific data**

---

## **Required Features Implemented**

### **Dashboard and Detail Views**
- [x] **List view** shows brewery name, city, state, type, and website.
- [x] Each brewery links to a **unique detail page** using `React Router`.
- [x] The **detail view** shows extended data, including nearby breweries.
- [x] The **Sidebar** is visible on both dashboard and detail views.

### **Charts and Visualizations**
- [x] **Bar chart** shows brewery count by type across filtered data.
- [x] **Pie chart** shows top 5 states with the most breweries.
- [x] **Line chart** shows type distribution for a selected state (if any).
- [x] **Bar chart** in the detail view shows types of nearby breweries.

---

## **Stretch Features Implemented**

- [x] **Detailed Brewery Page** – with maps, stats, and brewery type explanations.
- [x] **Dynamic Nearby Brewery List** – excludes the current brewery from results.
- [x] **Responsive Design** – fully mobile-friendly layout using Flex/Grid.
- [x] **Dark Theme** – Custom CSS theme with gradients and animations.
- [x] **Chart Toggle** – Show/hide dashboard visualizations on demand.
- [x] **Loading States** – Separate spinners for breweries and nearby breweries.
- [x] **404 Handling** – Gracefully informs users when a brewery is not found.

---

## **Video Walkthrough**

![Video Walkthrough](https://i.imgur.com/wf7e7MQ.gif)

GIF created with [peek](https://github.com/phw/peek) for Linux.

---

## **Repository**

GitHub Repository: [Data Dashboard Pro](https://github.com/alej4ndro-cm/brewery-data-dashboard-pro)

---

## **Notes & Challenges**

### **Bugs & Fixes**
- **Website links overflowing in cards**
  - **Fixed!** Added `word-break: break-word` and layout constraints on `.info-card` styling.
- **Nearby breweries not excluding current brewery**
  - **Fixed!** Added ID check to filter out current brewery from nearby results.
- **Initial chart data not responsive to filters**
  - **Fixed!** Moved chart data processing into filtered dataset logic.

---

## **Technologies Used**

- **React.js** for UI, routing, and component logic
- **React Router v6** for dynamic navigation and routes
- **Recharts** for data visualizations (Bar, Pie, Line charts)
- **Open Brewery DB API** for fetching real-time data
- **Custom CSS** for styling, theming, and layout

---

## **License**

Copyright 2025 Alejandro Munoz

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.