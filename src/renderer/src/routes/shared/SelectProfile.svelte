<script lang="ts">
  import { params } from '../../lib/stores/params.svelte.js'
  import { _ } from 'svelte-i18n'
  import { get } from 'svelte/store'
  import noskin from '../../assets/unknownplayer.png'
  import type { DraslPlayer } from '../../lib/types/login.js'
  import { ipc } from '../../main.js'
  import type { DraslRefreshRequest, launchCredentials } from 'xlicore'
  import { createNotification } from '../../components/StatusFeed.svelte'

  type Props = {
    finishCallback: Function
  }
  let { finishCallback = $bindable() }: Props = $props()

  async function selectProfile(player: DraslPlayer) {
    const body: DraslRefreshRequest = {
      accessToken: $params.shared.launchCredentials.accessToken!,
      clientToken: $params.shared.launchCredentials.clientId!,
      selectedProfile: {
        id: player.uuid.replaceAll('-', ''),
        name: player.name
      }
    }
    ipc.send('refresh-request', body)

    ipc.once('refresh-response', (_e, { launchCredentials, isError }: { launchCredentials: launchCredentials; isError: boolean }) => {
      if (isError) throw 'unknown'

      $params.shared.launchCredentials = launchCredentials
      $params.successfullLogin = true
      createNotification('selectprofile-selected', { name: launchCredentials.name, uuid: launchCredentials.uuid!.replace(/^(\w{8})(\w{4})(4\w{3})(\w{4})(\w{12})$/gm, '$1-$2-$3-$4-$5') })
      finishCallback()
    })
  }
</script>

<div class="container">
  {#each get(params).draslApiUser!.user.players as player}
    <button
      class="player"
      onclick={() => {
        selectProfile(player)
      }}
    >
      <span class="skin layer1" style="--skin: url('{player.skinUrl || noskin}');"></span>
      <span class="skin layer2" style="--skin: url('{player.skinUrl || noskin}');"></span>
      <p>{player.name}</p>
      <p class="uuid">{player.uuid}</p>
    </button>
  {/each}
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 1rem;

    button.player {
      display: grid;
      grid-template-columns: calc(8px * 4) 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 0 0.6rem;

      padding: 1rem;

      text-align: start;

      span.skin {
        grid-column: 1;
        grid-row: 1 / span 2;

        width: calc(8px * var(--scale));
        aspect-ratio: 1/1;

        background-image: var(--skin);
        background-position-x: calc(var(--posx) * var(--scale));
        background-position-y: calc(-8px * var(--scale));
        background-size: calc(64px * var(--scale));
        background-repeat: no-repeat;
        image-rendering: pixelated;
      }

      span.skin.layer1 {
        --scale: 4;
        --posx: -8px;
      }

      span.skin.layer2 {
        --scale: 4.25;
        --posx: -40px;
        transform: translateX(-1px);
      }

      p.uuid {
        font-size: 0.85em;
        opacity: 0.6;
      }
    }
  }
</style>
