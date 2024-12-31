<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements'
  import { ipc } from '../../scripts/general.js'
  import { CircleUserRound, KeySquare } from 'lucide-svelte'

  interface Props {
    next: MouseEventHandler<any>
  }
  let { next = $bindable() }: Props = $props()
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
    next(e)
    ipc.send('loginrequest', { username, password })
  }
</script>

<!-- TODO: IMPROVE UI -->

<h1>Вход в аккаунт</h1>
<p class="description">Если у тебя нет данных для входа, то их можно найти в [ДОБАВИТЬ ИСТОЧНИК]</p>
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

<style lang="scss">
  p.description {
    padding: 0 4rem;
  }
  .form {
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
</style>
