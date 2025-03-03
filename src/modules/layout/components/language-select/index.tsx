"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"
import { usePathname, useRouter } from "next/navigation"

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
]

const LanguageSelect = () => {
  const pathname = usePathname()
  const router = useRouter()
  const currentLanguage = pathname.split('/')[1] || 'en'

  const handleLanguageChange = (languageCode: string) => {
    const segments = pathname.split('/')
    if (segments[1]) {
      segments[1] = languageCode
    } else {
      segments.splice(1, 0, languageCode)
    }
    router.push(segments.join('/'))
  }

  return (
    <div>
      <Listbox value={currentLanguage} onChange={handleLanguageChange}>
        <div className="relative">
          <ListboxButton className="flex items-center py-1 text-sm gap-x-2">
            {languages.find(lang => lang.code === currentLanguage)?.label}
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-50 py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {languages.map((language) => (
                <ListboxOption
                  key={language.code}
                  value={language.code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-gray-100' : ''
                    }`
                  }
                >
                  {language.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelect 