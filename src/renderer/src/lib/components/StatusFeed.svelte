<script lang="ts">
  import { slide } from 'svelte/transition'
  import { sineOut } from 'svelte/easing'
  import type { StatusFeedEntry } from '../types/statusfeed.d'
  import { X } from 'lucide-svelte'

  let list: StatusFeedEntry[] = []
  let listElement

  async function scrollToBottom(el: Element): Promise<void> {
    el.scroll({ top: el.scrollHeight, behavior: 'smooth' })
  }

  let ipc = window.electron.ipcRenderer
  ipc.on('feed-push', (_event, { title, description, hide_after_secs }) => {
    console.log(`Got Feed-Push: ${title}, ${description}, ${hide_after_secs}`)
    console.log(description)
    let opts: StatusFeedEntry = {
      title: title,
      description: description
    }
    pushEntry(opts)
  })
  export function pushEntry(entry: StatusFeedEntry): void {
    let entryID = list.length >= 1 ? list[list.length - 1].id + 1 : 0
    entry = {
      ...entry,
      id: entryID
    }
    list = [...list, entry]
    console.log(list)
    console.log(`Added entry with ID ${entryID}`)

    setTimeout(() => {
      scrollToBottom(listElement)
    }, 200)
  }
  function removeEntry(id?: number): void {
    const index: number = list.indexOf(list.filter((x) => x.id == id)[0])
    console.log(`Removing entry with ID ${id}`)
    if (index > -1) {
      list.splice(index, 1)
      list = list
    }
  }
  function debugAddEntry(): void {
    setTimeout(() => {
      pushEntry({ title: 'Здесь водятся драконы!', description: 'В сборке могут быть ошибки. Пожалуйста, сообщите о них по кнопке в заголовке окна (WIP).' })
      pushEntry({ title: 'Здесь водятся драконы!', description: 'В сборке могут быть ошибки. Пожалуйста, сообщите о них по кнопке в заголовке окна (WIP).' })
      pushEntry({ title: 'Здесь водятся драконы!', description: 'В сборке могут быть ошибки. Пожалуйста, сообщите о них по кнопке в заголовке окна (WIP).' })
      pushEntry({ title: 'Здесь водятся драконы!', description: 'В сборке могут быть ошибки. Пожалуйста, сообщите о них по кнопке в заголовке окна (WIP).' })
      setTimeout(() => {
        pushEntry({ title: 'Здесь водятся драконы!', description: 'В сборке могут быть ошибки. Пожалуйста, сообщите о них по кнопке в заголовке окна (WIP).' })
      }, 500)
    }, 500)
  }
  debugAddEntry()
</script>

<div class="status-feed" bind:this={listElement}>
  <!-- <button on:click|self={debugAddEntry}>add entry</button> -->
  <ul>
    {#each list as { title, description, id } (id)}
      <li in:slide={{ delay: 0, duration: 200, easing: sineOut }} out:slide={{ duration: 150, easing: sineOut }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <!-- <debug>ID: {id}</debug> -->
        <button
          class="close"
          on:click={// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          () => {
            removeEntry(id)
          }}><X /></button
        >
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .status-feed {
    width: 16rem;
    max-height: calc(100dvh - 1.5rem - 3px);
    overflow-y: scroll;
    overflow-x: hidden;
    right: 0;
    bottom: 1px;
    position: fixed;
    margin: 0 0.5rem;
    flex-grow: 1;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border: 2px solid #0000;
      background-color: var(--color-background-lighter);
      background-clip: padding-box;
      border-radius: 500px;
    }

    ul {
      list-style: none;
      padding: 0;
      padding-bottom: 0.5rem;

      display: flex;
      flex-flow: column;

      li {
        border-radius: 0.4rem;
        background: radial-gradient(ellipse at 30% 12%, #f55c, #f550 70%);
        background-color: #f557;
        backdrop-filter: blur(5px);

        padding: 0.4rem 0.6rem;
        margin-top: 0.5rem;

        h3 {
          font-family: Unbounded;
          font-weight: 500;
          font-size: 1.15rem;
          font-style: italic;
          line-height: 1;
          margin: 0.15rem 0;

          transform: translateX(-2px);
        }

        p {
          line-height: 1.2;
          max-width: 16rem;
          text-wrap: balance;
          white-space: pre-line;
        }

        .close {
          position: absolute;
          top: 0;
          right: 0;
          width: 28px;
          height: 28px;

          padding: 0;
          margin: 0.25rem;

          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 0.3rem;
          background: #f550;
          border: none;
          transition: background-color 100ms;
          cursor: pointer;

          :global(.lucide) {
            width: 24px;
            color: #fff;
            opacity: 0.5;

            transition: transform 100ms;
          }

          &:hover {
            background-color: #f555;

            :global(.lucide) {
              opacity: 1;
            }
          }
        }
      }
    }
  }
</style>
