<template>
  <nav>
    <div class="logo">
      <span>Fit</span><em>Fuel</em>
    </div>
  </nav>
</template>

<script setup>
// Header-only nav for simplified flow.
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  height: 48px;
  background: rgba(247, 247, 245, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-family: var(--font-family);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.2px;
  white-space: nowrap;
}

.logo em {
  font-style: italic;
  color: var(--accent);
  margin-left: 1px;
}
</style>
