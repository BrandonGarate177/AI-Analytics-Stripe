# ![Stripe - Clone](https://stripechat.netlify.app/)


A React-based clone of Stripe's dashboard UI, built as a foundation for prototyping AI-powered analytics features in B2B SaaS applications.


https://github.com/user-attachments/assets/e109379d-05eb-4593-b49a-1054e4eeca04


## Purpose

This project serves as a UI shell for experimenting with AI-driven analytics features in a familiar, professional dashboard interface. It replicates Stripe's clean design patterns and component structure, providing a solid foundation for B2B SaaS product development.

## Features

- **Authentic Stripe UI**: Pixel-perfect recreation of Stripe's dashboard interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety and better developer experience
- **Modern Stack**: Built with React 18, TypeScript, and Tailwind CSS
- **Component-Based**: Modular architecture for easy customization and extension
- **Interactive Elements**: Hover states, transitions, and micro-interactions

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful, customizable icon library
- **PostCSS & Autoprefixer** - CSS processing and browser compatibility

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stripe-dashboard-clone.git
   cd stripe-dashboard-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar with menu items
│   ├── Header.tsx           # Top header with search and user menu
│   └── DashboardContent.tsx # Main dashboard content and metrics
├── App.tsx                  # Main application component
├── index.tsx               # Application entry point
└── index.css              # Global styles with Tailwind directives
```

## UI Components

### Sidebar Navigation
- Collapsible sidebar with Stripe-style navigation
- Active state indicators
- Responsive mobile behavior
- Icon-based menu items

### Dashboard Header
- Global search functionality (UI only)
- Environment mode indicator
- Notification bell with badge
- User profile dropdown

### Main Dashboard
- Revenue and payment metrics cards
- Trend indicators with up/down arrows
- Recent payments table
- Payment methods breakdown
- Placeholder chart areas

## 🔧 Customization

### Colors
The project uses Stripe's color palette defined in `tailwind.config.js`:
- **Primary Blue**: `#635bff`
- **Purple**: `#7c3aed`
- **Gray Scale**: Custom gray palette matching Stripe's design

### Adding New Components
1. Create new component files in `src/components/`
2. Import and use in `App.tsx` or other components
3. Follow the existing TypeScript patterns

### Styling
- Uses Tailwind CSS utility classes
- Custom color palette in `tailwind.config.js`
- Inter font family for typography
- Responsive design with mobile-first approach

## Current Status

**UI Shell Complete** 
- All major dashboard components implemented
- Responsive design working
- Hover states and transitions
- TypeScript integration

**Placeholder Elements** 
- Buttons are non-functional (as intended)
- Charts show placeholder content
- Search functionality is UI-only
- All data is static/mock data



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Stripe** - For the beautiful dashboard design inspiration
- **Tailwind CSS** - For the excellent utility-first CSS framework
- **Lucide** - For the clean, consistent icon set
- **React Team** - For the amazing React framework


**Note**: This is a UI clone created for educational and prototyping purposes. It is not affiliated with or endorsed by Stripe, Inc.
