<script lang="ts">
  import { ArrowLeft, Mail, X } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  import { route } from '../../lib/stores/route.svelte.js'
  import * as Sentry from '@sentry/svelte'
  import type { ModalProps } from '../../lib/types/modals.d.ts'
  import { createNotification } from '../../components/StatusFeed.svelte'
  import { ipc } from '../../main.js'

  let { exit = $bindable(), back = $bindable() }: ModalProps = $props()

  let input: string = $state('')

  function send() {
    if (input != '') {
      Sentry.captureMessage("[FE] " + input)
      ipc.send('capture-feedback', input)
      createNotification('feedback-sent')
      exit(new MouseEvent('fake'))
    }
  }
</script>

<div class="title">
  <button class="back" class:hidden={$route.modal.previous == null && back != null} onclick={back}><ArrowLeft /></button>
  <h2>{$_('modal.feedback.title')}</h2>
  <button class="close" onclick={exit}><X /></button>
</div>
<div class="wrapper">
  <p class="description">{$_('modal.feedback.description')}</p>
  <div class="textinput">
    <div class="label">
      <Mail />
      <p>{$_('modal.feedback.form.content')}</p>
    </div>
    <textarea class="resize" placeholder={$_('modal.feedback.form.placeholder')} bind:value={input}></textarea>
  </div>
  <button onclick={send}>{$_('modal.feedback.form.send')}</button>
</div>

<style lang="scss">
  div.title {
    width: 100%;
    display: flex;
    justify-content: space-between;

    padding: 0.2rem;

    border-bottom: solid 1px var(--color-border);

    h2 {
      font-family: Unbounded;
      transform: translateY(2px);
    }
    button:is(.close, .back) {
      top: 0.2rem;

      width: 2rem;
      height: 2rem;

      padding: 0.2rem;
      border-radius: 0.2rem;
      background-color: #0000;
      color: white;
      outline: solid 2px transparent;

      cursor: pointer;

      transition:
        background-color 80ms,
        outline-color 100ms,
        filter 100ms;

      &:is(:hover, :focus-visible) {
        background-color: #0004;
        outline: solid 2px var(--theme-accent-active);
        filter: drop-shadow(0 0 3px var(--theme-accent-active-darker));
      }
      &.close {
        right: 0.2rem;
      }
      &.back {
        left: 0.2rem;
      }
      &.hidden {
        visibility: hidden;
      }
    }
  }
  div.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 8px 3rem;
    padding-right: calc(3rem - 8px);
    gap: 8px;

    overflow-y: scroll;

    & {
      // scrollbar
      &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        border: solid 2px #0000;
        background-clip: content-box;
        background-color: #fff1;
        border-radius: 9999px;
      }
      &::-webkit-scrollbar-button {
        width: 4px;
        height: 4px;
      }
    }

    > p.description {
      opacity: 0.4;
      font-size: 0.8rem;
      margin: 0;

      text-align: center;
      white-space: pre-line;
      line-height: 1.2;
    }

    > .textinput {
      display: grid;
      grid-template-columns: auto 1fr;

      background-color: #0006;
      padding: 0.4rem;
      outline: solid 2px var(--theme-accent-inactive);
      border-radius: 0.5rem;

      transition:
        color 200ms,
        font-weight 200ms,
        stroke-width 200ms,
        outline 200ms;

      .label {
        display: flex;
        justify-content: end;
        align-content: end;
        gap: 0.4rem;
        margin-left: 0.2rem;
        margin-right: 0.6rem;
      }
      textarea {
        display: block;
        overflow: hidden;
        outline: none;
        min-height: 100%;
        height: 1rem;
        max-height: 50dvh;
        min-width: 10rem;
        width: 100%;
        max-width: 42dvw;

        padding: 0.3rem;

        resize: none;

        &.resize {
          resize: both;
        }

        &:focus {
          filter: none;
        }
      }
    }
  }
</style>
