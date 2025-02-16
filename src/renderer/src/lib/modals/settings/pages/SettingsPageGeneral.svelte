<script lang="ts">
  import { _, locale } from 'svelte-i18n'
  import { route, type RouteModal } from '../../../stores/route.svelte.js'
  import OptionButton from '../components/OptionButton.svelte'
  import OptionDropdown from '../components/OptionDropdown.svelte'
  import { params } from '../../../stores/params.svelte.js'
  import SettingsModal from '../SettingsModal.svelte'
  import ModpackModal from '../../ModpackModal.svelte'
  import type { Component } from 'svelte'
  import AccountPage from '../../../pages/account/AccountPage.svelte'

  function goToModal(where: RouteModal) {
    $route.modal.previous = SettingsModal
    $route.modal.current = where
  }
  function goToPage(where: Component<any>) {
    $route.page = where
    $route.modal.previous = null
    $route.modal.current = null
  }

  function handleLocaleChange(newLocal: string) {
    $route.modal.previous = null
    $route.modal.current = null
    $route.loaded = false
    locale.set(newLocal)
    $params.lang = newLocal
    setTimeout(() => {
      $route.loaded = true
    }, 1000)
  }
</script>

<main>
  <OptionButton
    name={$_('modal.settings.pages.general.options.account.name')}
    description={$_('modal.settings.pages.general.options.account.description')}
    actionLabel={$_('modal.settings.pages.general.options.account.label')}
    onclick={() => {
      goToPage(AccountPage)
    }}
  />
  <OptionButton
    name={$_('modal.settings.pages.general.options.modpack.name')}
    description={$_('modal.settings.pages.general.options.modpack.description')}
    actionLabel={$_('modal.settings.pages.general.options.modpack.label')}
    onclick={() => {
      goToModal(ModpackModal)
    }}
  />
  <OptionDropdown
    name={$_('modal.settings.pages.general.options.language.name')}
    description={$_('modal.settings.pages.general.options.language.description')}
    actionLabel={$_('modal.settings.pages.general.options.language.label')}
    onclick={() => {}}
    options={[
      {
        name: `${$_('meta.langnames.ru')} (Русский)`,
        action: () => {
          handleLocaleChange('ru')
        }
      },
      {
        name: `${$_('meta.langnames.en')} (English)`,
        action: () => {
          handleLocaleChange('en')
        }
      }
    ]}
  />
</main>
