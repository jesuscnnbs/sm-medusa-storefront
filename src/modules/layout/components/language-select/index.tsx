"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"
import ReactCountryFlag from "react-country-flag"
import { usePathname, useRouter } from "next/navigation"

const languages = [
  { code: "en", label: "English", flag: "gb" },
  { code: "es", label: "Español", flag: "es" },
]

const LanguageSelect = () => {
  const pathname = usePathname()
  const router = useRouter()
  const currentLanguage = pathname.split("/")[1] || "en"
  const currentLanguageData = languages.find((lang) => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode === currentLanguage) {
      return
    }
    const segments = pathname.split("/")
    if (segments[1]) {
      segments[1] = languageCode
    } else {
      segments.splice(1, 0, languageCode)
    }
    router.push(segments.join("/"))
  }

  return (
    <div>
      <Listbox value={currentLanguage} onChange={handleLanguageChange}>
        <div className="relative">
          <ListboxButton className="flex items-center py-1 text-sm gap-x-1">
            <ReactCountryFlag
                    svg
                    style={{
                      width: "40px",
                      height: "20px",
                      float: "left",
                    }}
                    countryCode={currentLanguageData?.flag ?? ""}
                  />
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-50 py-1 mt-1 overflow-auto rounded-sm shadow-lg bg-ui-bg-base ring-1 ring-black ring-opacity-5 focus:outline-none">
              {languages.map((language) => (
                <ListboxOption
                  key={language.code}
                  value={language.code}
                  className={({ selected }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      selected ? "bg-ui-bg-base-pressed" : ""
                    }`
                  }
                >
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "20px",
                      height: "20px",
                      float: "left",
                    }}
                    countryCode={language.flag ?? ""}
                  />
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
