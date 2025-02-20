<script lang="ts">
  import { ipc } from '../../../../main.js'
  import { CircleUserRound, KeySquare } from 'lucide-svelte'
  import { params } from '../../../../lib/stores/params.svelte.js'
  import { _ } from 'svelte-i18n'
  import { onMount } from 'svelte'

  interface Props {
    next: Function
  }
  let { next = $bindable() }: Props = $props()
  let username = $state('')
  let password = $state('')

  let usernameInput: HTMLInputElement, passwordInput: HTMLInputElement

  let isUsernameValid: boolean = $state(false)
  let showUsernameInvalid: boolean = $state(false)

  let isPasswordValid: boolean = $state(false)
  let showPasswordInvalid: boolean = $state(false)

  let isLoggingIn: boolean = $state(false)

  function oninputUsername(): void {
    onunfocusUsername()
    isUsernameValid = username.match(/^[a-zA-Z0-9_]{3,16}$/) != null
  }
  function onunfocusUsername(): void {
    showUsernameInvalid = true
  }
  function onkeypressUsername(e: KeyboardEvent): void {
    if (e.key === 'Enter') passwordInput.focus()
  }

  function oninputPassword(): void {
    onunfocusPassword()
    isPasswordValid = password.length > 0
  }
  function onunfocusPassword(): void {
    showPasswordInvalid = true
  }
  function onkeypressPassword(e: KeyboardEvent): void {
    if (e.key === 'Enter') login()
  }

  function login(): void {
    isLoggingIn = true
    ipc.send('loginrequest', { username, password })
  }

  ipc.on('loginresponse', (_event, { launchCredentials }) => {
    console.log(`Got loginresponse`)
    isLoggingIn = false
    if (!launchCredentials.uuid) {
      username = ''
      password = ''
      isUsernameValid = false
      isPasswordValid = false
      return
    }
    $params.launchCredentials = launchCredentials
    next()
    ipc.removeAllListeners('loginresponse')
  })

  onMount(() => {
    usernameInput.focus()
  })
</script>

<!-- TODO: IMPROVE UI -->

<h1>{$_('modal.login.title')}</h1>
<p class="description">Если у тебя нет данных для входа, то их можно найти в [ДОБАВИТЬ ИСТОЧНИК]</p>
<div class="form">
  <div class="textinput" class:incorrect={!isUsernameValid && showUsernameInvalid}>
    <div class="label">
      <CircleUserRound />
      <p>{$_('modal.login.form.username')}</p>
    </div>
    <input type="text" bind:this={usernameInput} bind:value={username} disabled={isLoggingIn} oninput={oninputUsername} onfocusout={onunfocusUsername} onkeypress={onkeypressUsername} />
  </div>
  <div class="textinput" class:incorrect={!isPasswordValid && showPasswordInvalid}>
    <div class="label">
      <KeySquare />
      <p>{$_('modal.login.form.password')}</p>
    </div>
    <input type="password" bind:this={passwordInput} bind:value={password} disabled={isLoggingIn} oninput={oninputPassword} onfocusout={onunfocusPassword} onkeypress={onkeypressPassword} />
  </div>
  <button onclick={login} class="login" disabled={!isUsernameValid || !isPasswordValid || isLoggingIn}>{$_('modal.login.form.action')}</button>
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

      &:has(>input:disabled) {
        filter: brightness(50%);
      }

      div.label {
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

        position: relative;

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
