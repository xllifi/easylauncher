<script lang="ts">
  import { fly } from 'svelte/transition'
  import { sineIn, sineOut } from 'svelte/easing'
  import type { StatusFeedEntry } from '../types/statusfeed.d.ts'
  import { X } from 'lucide-svelte'
  import { flip } from 'svelte/animate'
  import { ipc } from '../shared/general.js'

  let list: StatusFeedEntry[] = []
  let listElement: Element

  let flipDelay = 0

  async function scrollToBottom(el: Element): Promise<void> {
    el.scroll({ top: el.scrollHeight, behavior: 'smooth' })
  }

  ipc.on('feed-push', (_event, { title, description }) => {
    console.log(`Got Feed-Push: ${title}, ${description}`)
    console.log(description)
    let opts: StatusFeedEntry = {
      title: title,
      description: description
    }
    pushEntry(opts)
  })
  export function pushEntry(entry: StatusFeedEntry): void {
    flipDelay = 0
    let entryID = list[0] && list[0].id ? list[0].id + 1 : 0
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
    pushEntry({ title: 'Тестовая версия', description: 'Если вы столкнулись с проблемой в работе лаунчера или у вас есть предложения по улучшению, сообщите разработчику по кнопке в заголовке окна.' })
  }
  debugAddEntry()
</script>
<div class="status-feed" bind:this={listElement}>
  <ul class="scrollable">
    {#each list as { title, description, id } (id)}
      <li in:fly={{ delay: 100, duration: 200, x: 100, y: 0, easing: sineOut }} out:fly={{ delay: 0, duration: 200, x: 100, y: 0, easing: sineIn }} animate:flip={{ delay: flipDelay, duration: 200 }}>
        <h3>{title}</h3>
        <p>{description}</p>
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
    height: calc(100dvh - 1.5rem);
    overflow: hidden;
    right: 0;
    bottom: 0;
    position: fixed;
    flex-grow: 1;

    pointer-events: none;

    ul.scrollable {
      overflow-y: scroll;
      overflow-x: hidden;

      list-style: none;
      padding: 0.4rem;

      height: 100%;

      display: flex;
      flex-flow: column-reverse;

      &::-webkit-scrollbar {
        width: 0;
      }

      li {
        border-radius: 0.3rem;
        background: radial-gradient(ellipse at 30% 12%, var(--theme-accent-active), #f550 70%);
        background-color: var(--theme-accent-active-darker);
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

        button.close {
          position: absolute;
          right: 0.6rem;
          top: 0.6rem;
          width: 1.5rem;
          height: 1.5rem;

          padding: 0;
          border-radius: 0.2rem;
          background-color: #0000;
          color: white;
          outline: solid 2px transparent;
          border: none;

          display: flex;
          justify-content: center;
          align-items: center;

          cursor: pointer;

          transition:
            background-color 80ms,
            outline-color 100ms,
            filter 100ms;

          &:is(:hover, :focus-visible) {
            background-color: #0004;
            outline: solid 2px var(--theme-accent-active);
            filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));

            :global(.lucide) {
              opacity: 1;
            }
          }

          :global(.lucide) {
            width: 24px;
            color: #fff;
            opacity: 0.5;

            transition: transform 100ms;
          }
        }
      }
    }
  }
</style>
