<script lang="ts">
  import { fly } from 'svelte/transition'
  import { sineIn, sineOut } from 'svelte/easing'
  import type { StatusFeedEntry } from '../types/statusfeed.d'
  import { X } from 'lucide-svelte'
  import { flip } from 'svelte/animate'

  let list: StatusFeedEntry[] = []
  let listElement: Element

  let flipDelay = 0

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
    flipDelay = 0
    let entryID = list.length > 0 ? list[0].id + 1 : 0
    entry = {
      ...entry,
      id: entryID
    }
    list = [entry, ...list]
    console.log(list)
    console.log(`Added entry with ID ${entryID}`)

    setTimeout(() => {
      scrollToBottom(listElement)
    }, 0)
  }
  function removeEntry(id?: number): void {
    flipDelay = 100
    const index: number = list.indexOf(list.filter((x) => x.id == id)[0])
    console.log(`Removing entry with ID ${id}`)
    if (index > -1) {
      list.splice(index, 1)
      list = list
    }
  }
  function debugAddEntry(): void {
    pushEntry({ title: 'Здесь водятся драконы!', description: 'В сборке могут быть ошибки. Пожалуйста, сообщите о них по кнопке в заголовке окна.\n(WIP)' })
  }
  debugAddEntry()
</script>

<div class="status-feed" bind:this={listElement}>
  <ul class="scrollable">
    <!-- <button on:click|self={debugAddEntry}>[DEBUG]add entry</button> -->
    {#each list as { title, description, id } (id)}
      <li 
        in:fly={{ delay: 100, duration: 200, x: 100, y: 0, easing: sineOut }} 
        out:fly={{ delay: 0, duration: 200, x: 100, y: 0, easing: sineIn }} 
        animate:flip={{ delay: flipDelay, duration: 200 }}
      >
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
  div.status-feed {
    width: 18rem;
    height: calc(100dvh - 1.5rem - 3px);
    overflow: hidden;
    right: 2px;
    bottom: 2px;
    position: fixed;
    margin: 0.4rem;
    flex-grow: 1;
    
    pointer-events: none;

    ul.scrollable {
      overflow-y: scroll;
      overflow-x: hidden;

      list-style: none;
      padding: 0;

      height: 100%;

      display: flex;
      flex-flow: column-reverse;

      &::-webkit-scrollbar {
        width: 0.5rem;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border: 2px solid #0000;
        background-color: var(--color-background-lighter);
        background-clip: padding-box;
        border-radius: 500px;
      }

      li {
        border-radius: 0.3rem;
        background: radial-gradient(ellipse at 30% 12%, #f55c, #f550 70%);
        background-color: #f557;
        backdrop-filter: blur(5px);

        padding: 0.4rem 0.6rem;
        margin-top: 0.5rem;

        
        pointer-events: all;
        user-select: all;

        h3 {
          font-family: Unbounded;
          font-weight: 500;
          font-size: 1.15rem;
          font-style: italic;
          line-height: 1;
          margin: 0.15rem 0;

          width: calc(100% - 1.25rem);

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

          &:is(:hover, :focus) {
            background-color: #f555;

            &:focus {
              outline: solid 2px var(--theme-accent-active);
              outline-offset: -2px;
            }

            :global(.lucide) {
              opacity: 1;
            }
          }
        }
      }
    }
  }
</style>
