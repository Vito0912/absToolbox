<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">
          <router-link to="/" class="nav-link">📚 ABS Toolbox</router-link>
        </h1>
        <div class="nav-links">
          <router-link to="/" class="nav-item" active-class="active">Tools</router-link>
          <router-link to="/settings" class="nav-item" active-class="active">Settings</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-link {
  text-decoration: none;
  color: #1f2937;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.nav-item:hover,
.nav-item.active {
  color: #3b82f6;
  background: #eff6ff;
}

.main-content {
  flex: 1;
}
</style>