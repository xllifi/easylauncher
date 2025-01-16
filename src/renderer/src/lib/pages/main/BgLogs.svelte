<script lang="ts">
  import { ipc } from "../../scripts/general.js"

  let lines: string[] = []

  ipc.on('logs', (_e, { data }) => {
    lines = [data, ...lines]
  })
</script>

<div class="logwrapper">
  {#each lines as line}
    <p class="log">{line}</p>
  {/each}
</div>

<style lang="scss">
  .logwrapper {
    position: absolute;
    right: 0;
    bottom: -2rem;
    width: 100dvw;
    height: calc(100dvh - 2rem);

    z-index: -5;
    opacity: 0.1;

    display: flex;
    flex-direction: column-reverse;

    white-space: nowrap;
    // background-color: red;

    perspective: 400px;
    transform: rotateX(20deg) rotateY(10deg);

    > p {
      font-size: 0.8rem;
    }
  }
</style>
