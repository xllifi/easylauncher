<script lang="ts">
  import { ArrowLeft, CircleUserRound, KeySquare, X } from 'lucide-svelte'
  import type { MouseEventHandler } from 'svelte/elements'
  import { ipc } from '../../scripts/general.js'
  import { route } from '../../stores/route.svelte.js'

  interface Props {
    exit: MouseEventHandler<any>,
    back: MouseEventHandler<any>
  }
  let { exit = $bindable(), back = $bindable() }: Props = $props()

  let username = $state('')
  let password = $state('')

  let isUsernameValid: boolean = $state(false)
  let showUsernameInvalid: boolean = $state(false)

  let isPasswordValid: boolean = $state(false)
  let showPasswordInvalid: boolean = $state(false)

  function oninputUsername(): void {
    onunfocusUsername()
    isUsernameValid = username.match(/^[a-zA-Z0-9_]{3,16}$/) != null
  }
  function onunfocusUsername(): void {
    showUsernameInvalid = true
  }

  function oninputPassword(): void {
    onunfocusPassword()
    isPasswordValid = password.length > 0
  }
  function onunfocusPassword(): void {
    showPasswordInvalid = true
  }

  function login(e): void {
    if (!isUsernameValid) return
    exit(e)
    ipc.send('loginrequest', { username, password })
  }
</script>

<!-- TODO: IMPROVE UI -->

<div class="layout">
  <div class="title">
    <button class="back" class:hidden={$route.overlay.previous == 'none'} onclick={back}><ArrowLeft /></button>
    <h2>Вход в аккаунт</h2>
    <button class="close" onclick={exit}><X /></button>
  </div>
  <div class="form">
    <div class="textinput" class:incorrect={!isUsernameValid && showUsernameInvalid}>
      <div class="label">
        <CircleUserRound />
        <p>Никнейм</p>
      </div>
      <input type="text" bind:value={username} oninput={oninputUsername} onfocusout={onunfocusUsername} />
    </div>
    <div class="textinput" class:incorrect={!isPasswordValid && showPasswordInvalid}>
      <div class="label">
        <KeySquare />
        <p>Пароль</p>
      </div>
      <input type="password" bind:value={password} oninput={oninputPassword} onfocusout={onunfocusPassword} />
    </div>
    <button onclick={login} class="login" disabled={!isUsernameValid || !isPasswordValid}>Войти!</button>
  </div>
</div>

<style lang="scss">
  div.layout {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

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
      flex: 1 0 0;

      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.6rem;

      width: 16rem;

      .textinput {
        display: grid;
        grid-template-columns: 1fr 1fr;

        background-color: #0006;
        padding: 0.4rem;
        outline: solid 2px var(--theme-accent-inactive);
        border-radius: 0.5rem;

        transition:
          color 200ms,
          font-weight 200ms,
          stroke-width 200ms,
          outline 200ms;

        &.incorrect {
          font-weight: 800;
          outline: solid #f55 2px;
          filter: drop-shadow(0 0 1px #b336);

          :global(.lucide) {
            stroke-width: 2.5px;
          }
          *:not(input) {
            color: #f55;
          }
        }

        .label {
          display: flex;
          justify-content: end;
          align-content: end;
          gap: 0.4rem;
          margin-right: 0.6rem;
        }
        input {
          outline: none;
          height: 100%;
          width: 100%;

          &:focus {
            filter: none;
          }
        }
      }

      button.login {
        width: 100%;
        margin: 0;
        border-radius: 0.5rem;
        font-size: 1rem;
      }
    }
  }
</style>
