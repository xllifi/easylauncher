<div class="status-feed">
  <ul>
    <li>
      <h3>Заголовок</h3>
      <p>Описание записи в ленте статуса</p>
    </li>
    <li>
      <h3>Длинный заголовок большой записи</h3>
      <p>Прямо очень длинное описание записи в ленте статуса, много символов и букв. И ещё немного текста в описание.</p>
    </li>
  </ul>
</div>

<style lang="scss">
  .status-feed {
    width: 16rem;
    right: 0;
    bottom: 1px;
    position: fixed;
    margin: 0.5rem;
    flex-grow: 1;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        border-radius: 0.2rem;
        background-color: #f55c;
        backdrop-filter: blur(5px);

        padding: 0.4rem 0.6rem;
        margin-top: 0.5rem;

        &:first-of-type {
          margin-top: 0;
        }

        h3 {
          font-family: Unbounded;
          font-weight: 500;
          font-size: 1.3rem;
          font-style: italic;
          line-height: 1.2;
        }

        p {
          line-height: 1.2;
          max-width: 16rem;
          text-wrap: balance;
        }
      }
    }
  }
</style>
