"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"

const HomeIconLink = () => {
  return (
    <>
      <SantaMonicaIcon size={40} />
      <span className="mt-[2px] hidden mx-2 text-[22px] font-medium uppercase align-middle small:block text-secondary-sm font-lemonMilk">
        Santa
        <br/>
        <span className="text-[17px]">Mónica</span>
      </span>
    </>
  )
}

const SideMenu = ({
  menuItems,
}: {
  menuItems: { [key: string]: {href: string; name: string} }
}) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full gap-4">
        <Popover className="flex h-full outline-none focus:outline-none focus-visible:outline-none">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <PopoverButton
                  data-testid="nav-menu-button"
                  className="relative flex items-center h-full transition-transform active:scale-95"
                >
                  <HomeIconLink />
                </PopoverButton>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-x-10"
                enterTo="opacity-100 backdrop-blur-2xl translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl translate-x-0"
                leaveTo="opacity-0 -translate-x-10"
              >
                <PopoverPanel className="absolute inset-x-0 z-30 flex flex-col w-full h-screen pr-4 m-0 overflow-hidden text-sm sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min text-dark-sm-darker">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col justify-between h-full p-6 overflow-hidden border-x-2 bg-light-sm-lighter border-dark-sm"
                  >
                    <div className="absolute pointer-events-none right-2 opacity-15 bottom-2">
                      <SantaMonicaIcon size={750} />
                    </div>
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col items-start justify-start gap-6 font-lemonMilk">
                      {Object.entries(menuItems).map(([_name, item]) => {
                        return (
                          <li key={item.name}>
                            <LocalizedClientLink
                              href={item.href}
                              className="text-3xl leading-10 hover:text-ui-fg-disabled"
                              onClick={close}
                              data-testid={`${item.name.toLowerCase()}-link`}
                            >
                              {item.name}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div
                        className="flex justify-between"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                      </div>
                      <Text className="flex justify-between txt-compact-small">
                        © {new Date().getFullYear()} Santa Mónica. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
