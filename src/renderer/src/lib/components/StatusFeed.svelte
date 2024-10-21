<script lang="ts">
  import { slide } from 'svelte/transition'
  import { sineOut } from 'svelte/easing'
  import type { StatusFeedEntry } from '../types/statusfeed.d'
  import { X } from 'lucide-svelte'

  let entries: StatusFeedEntry[] = []

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
    let entryID = entries.length >= 1 ? entries[entries.length - 1].id + 1 : 0
    entry = {
      ...entry,
      id: entryID
    }
    entries = [...entries, entry]
    console.log(entries)
    console.log(`Added entry with ID ${entryID}`)

    setTimeout(() => {
      const list = document.querySelector('div#status_feed')
      list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
    }, 200)
  }
  function removeEntry(id?: number): void {
    const index: number = entries.indexOf(entries.filter((x) => x.id == id)[0])
    console.log(`Removing entry with ID ${id}`)
    if (index > -1) {
      entries.splice(index, 1)
      entries = entries
    }
  }
  function debugAddEntry(): void {
    pushEntry({ title: 'Заголовок в две строчки и ещё', description: 'Описание записи' })
  }
  debugAddEntry()
</script>

<div class="status-feed" id="status_feed">
  <!-- <button on:click|self={debugAddEntry}>add entry</button> -->
  <ul>
    {#each entries as { title, description, id } (id)}
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
    max-height: calc(100dvh - 2.5rem);
    overflow-y: scroll;
    overflow-x: hidden;
    right: 0;
    bottom: 1px;
    position: fixed;
    margin: 0.5rem;
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

      display: flex;
      flex-flow: column;

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
          line-height: 0.9;
          margin: 0.2rem 0;

          transform: translateX(-2px);
        }

        p {
          line-height: 1.2;
          max-width: 16rem;
          text-wrap: balance;
          white-space: pre-line;
        }

        button {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;

          padding: 0;
          margin: 0;

          display: flex;
          justify-items: center;
          align-items: center;

          background: transparent;
          border: none;

          :global(.lucide) {
            width: 24px;
            color: #fff;
            opacity: 0.5;

            transition: transform 100ms;
          }

          &:hover :global(.lucide) {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      }
    }
  }
</style>
