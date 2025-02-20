<script lang="ts">
  import { ipc } from "../../../main.js"

  let lines: string[] = []

  function filterSensitive(data: string): string {
    const ipv6pattern = /((([0-9a-fA-F]){1,4})\\:){7}([0-9a-fA-F]){1,4}/g
    const ipv4pattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g

    data = data.replace(/([A-Z]:\\Users\\).+?(\\)/gm, '$1****$2')
    data = data.replace(ipv6pattern, 'IPv6***.***.***.***')
    data = data.replace(ipv4pattern, 'IPv4***.***.***.***')
    return data
  }

  ipc.on('logs', (_e, { data }) => {
    lines = [filterSensitive(data), ...lines]
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
    height: calc(100dvh + 4rem);

    z-index: -5;
    opacity: 0.1;

    display: flex;
    flex-direction: column-reverse;

    white-space: nowrap;
    background: radial-gradient(circle at center, #fff2 60%, #ffff 100%);
    color: transparent;
    background-clip: text;

    perspective: 400px;
    transform: rotateX(20deg) rotateY(10deg);

    > p {
      font-size: clamp(0.6rem, min(2.25dvh, 2.25dvw), 1rem);
    }
  }
</style>
