<template>
  <div class="loading">
    <h2>.正在加载中.</h2>
    <div class="load-item">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: rgba(54, 54, 94, 0.99);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h2 {
    color: #ccc;
    margin: 0;
    font: 1.2em verdana;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .load-item {
    margin-top: 20px;
    span {
      display: inline-block;
      vertical-align: middle;
      width: 1em;
      height: 1em;
      margin: 0.2em;
      background: #007db6;
      border-radius: 0.6em;
      animation: loading 1s infinite alternate;
      &:nth-of-type(2) {
        background: #008fb2;
        animation-delay: 0.2s;
      }
      &:nth-of-type(3) {
        background: #009b9e;
        animation-delay: 0.4s;
      }
      &:nth-of-type(4) {
        background: #00a77d;
        animation-delay: 0.6s;
      }
      &:nth-of-type(5) {
        background: #00b247;
        animation-delay: 0.8s;
      }
      &:nth-of-type(6) {
        background: #5ab027;
        animation-delay: 1s;
      }
      &:nth-of-type(7) {
        background: #a0b61e;
        animation-delay: 1.2s;
      }
      @keyframes loading {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  }
}
</style>