<script lang="ts">
  import { _, locale } from "svelte-i18n"
  import { route } from "../../../stores/route.svelte.js"
  import OptionButton from "../components/OptionButton.svelte"
  import OptionDropdown from "../components/OptionDropdown.svelte"
  import { params } from "../../../stores/params.svelte.js"

  function goTo(page: string) {
    $route.overlay.previous = 'settings'
    $route.overlay.current = page
  }

  function handleLocaleChange(newLocal: string) {
    $route.loaded = false
    locale.set(newLocal)
    $params.lang = newLocal
    location.reload()
  }
</script>

<main>
  <OptionButton name="Вход в аккаунт" actionLabel="Перейти ко входу" onclick={() => {goTo('login')}} />
  <OptionButton name="Изменить тип сборки" actionLabel="Перейти к выбору" onclick={() => {goTo('modpack')}} />
  <OptionDropdown name="Язык" actionLabel="Выбрать язык" onclick={() => {}} options={[
    {
      name: `${$_('meta.langnames.ru')} (Русский)`,
      action: () => {handleLocaleChange('ru')}
    },
    {
      name: `${$_('meta.langnames.en')} (English)`,
      action: () => {handleLocaleChange('en')}
    }
  ]} />
</main>
