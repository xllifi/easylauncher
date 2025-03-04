<script lang="ts">
  import { ArrowLeft, X } from 'lucide-svelte'
  import { route } from '../../lib/stores/route.svelte.js'
  import { _ } from 'svelte-i18n'
  import Login from "../shared/Login.svelte"
  import type { ModalProps } from '../../lib/types/modals.d.ts'
  import SelectProfileModal from './SelectProfileModal.svelte'
  import { params } from '../../lib/stores/params.svelte.js'

  let { exit = $bindable(), back = $bindable() }: ModalProps = $props()

  function maybeOpenProfileSelection() {
    if (!$params.draslApiUser) {
      return
    }
    if ($params.draslApiUser?.user.players.length > 1) {
      $route.modal.previous = null
      $route.modal.current = SelectProfileModal
    } else {
      $params.successfullLogin = true
      exit(new MouseEvent('fake'))
    }
  }
</script>

<div class="layout">
  <div class="title">
    <button class="back" class:hidden={$route.modal.previous == null} onclick={back}><ArrowLeft /></button>
    <h2>{$_('modal.login.title')}</h2>
    <button class="close" onclick={exit}><X /></button>
  </div>
  <div class="form">
    <Login finishCallback={maybeOpenProfileSelection} />
  </div>
</div>

<style lang="scss">
  div.layout {
    width: 100%;
    height: 100%;

    .title {
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

    .form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
</style>
