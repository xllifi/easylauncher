<script lang="ts" module>
  import { fly, slide } from 'svelte/transition'
  import { sineIn, sineOut } from 'svelte/easing'
  import type { StatusFeedEntry } from '../lib/types/components.d.ts'
  import { ClipboardCopy, X } from 'lucide-svelte'
  import { flip } from 'svelte/animate'
  import { _ } from 'svelte-i18n'
  import { tooltip } from '../lib/actions/tooltip.svelte.js'

  let list: StatusFeedEntry[] = $state([])

  export function createNotification(id: string, additional?: { [key: string]: string }, verboseString?: string): void {
    let description = `statusfeed.messages.${id}.description`
    let opts: StatusFeedEntry = {
      title: `statusfeed.messages.${id}.title`,
      description
    }
    if (additional) {
      opts.add = {
        values: additional
      }
    }
    if (verboseString) {
      opts.verbose = {
        content: verboseString,
        expanded: false
      }
    }
    pushEntry(opts)
  }

  function pushEntry(entry: StatusFeedEntry): void {
    console.log(entry)
    let entryID = 0
    if (list.length > 0 && list[0].id != undefined) {
      entryID = list[0].id + 1
    }
    entry = {
      ...entry,
      id: entryID
    }
    list = [entry, ...list]
  }
  function removeEntry(id?: number): void {
    const index: number = list.indexOf(list.filter((x) => x.id == id)[0])
    if (index > -1) {
      list.splice(index, 1)
      list = list
    }
  }
</script>

<svelte:window
  onoffline={() => {
    createNotification('gotoffline')
  }}
  ononline={() => {
    createNotification('gotonline')
  }}
/>

<div class="status-feed">
  <ul class="scrollable">
    {#each list as { title, description, add, verbose, id } (id)}
      <li oncopy={(e) => {
        e.preventDefault()
        navigator.clipboard.writeText(`${$_(title, add)}\n${$_(description, add)}` + (verbose ? `\n\n${$_('statusfeed.verbose_copy')}\n${verbose!.content}` : ''))
      }} in:fly={{ delay: 100, duration: 200, x: 100, y: 0, easing: sineOut }} out:fly={{ delay: 0, duration: 200, x: 100, y: 0, easing: sineIn }} animate:flip={{ duration: 200 }}>
        <h3>{$_(title, add)}</h3>
        <p>{$_(description, add)}</p>
        {#if verbose}
          <div class="verbose">
            <button onclick={() => (verbose.expanded = !verbose.expanded)}>{$_('statusfeed.verbose_button')}</button>
            {#if verbose.expanded}
              <p transition:slide={{ duration: 200 }}>
                {verbose.content}
              </p>
            {/if}
          </div>
        {/if}
        <div class="buttons">
          <button
          use:tooltip={[$_('statusfeed.close_button_tooltip')]}
            onclick={() => {
              removeEntry(id)
            }}><X /></button
          >
          <button
            use:tooltip={[$_('statusfeed.copy_button_tooltip')]}
            onclick={() => {
              navigator.clipboard.writeText(`${$_(title, add)}\n${$_(description, add)}` + (verbose ? `\n\nПодробости:\n${verbose!.content}` : ''))
            }}><ClipboardCopy /></button
          >
        </div>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  div.status-feed {
    width: 18rem;
    height: calc(100dvh - 2rem);
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

        :is(h3, p) {
          user-select: text;

          &::selection {
            background-color: #c55;
          }
        }

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
          word-wrap: break-word;
          white-space: pre-line;
          pointer-events: all;
        }

        div.buttons {
          position: absolute;
          right: 0.4rem;
          top: 0.4rem;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.2rem;

          button {
            width: 1.5rem;
            height: 1.5rem;

            margin: 0;
            padding: 0.125rem;
            border-radius: 0.2rem;
            background-color: #0000;
            color: white;
            outline: solid 2px transparent;

            cursor: pointer;

            transition:
              background-color 80ms,
              outline-color 100ms,
              filter 100ms;

            :global(.lucide) {
              width: 24px;
              color: #fff;
              opacity: 0.2;

              transition: transform 100ms;
            }

            &:is(:hover, :focus-visible) {
              background-color: #0004;
              outline: solid 2px var(--theme-accent-active);
              filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));

              :global(.lucide) {
                opacity: 1;
              }
            }
          }
        }

        div.verbose > {
          button {
            margin: 0.2rem 0;
          }
          p {
            margin-top: 0.4rem;
            background-color: #0006;
            border-radius: 0.2rem;
            padding: 0.4rem;
            position: relative;
          }
        }
      }
    }
  }
</style>
