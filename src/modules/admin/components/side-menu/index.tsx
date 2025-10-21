"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Text, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"

const AdminSideMenu = ({
  menuItems,
}: {
  menuItems: { [key: string]: { href: string; name: string } }
}) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full gap-4">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <PopoverButton
                  data-testid="admin-nav-menu-button"
                  className="relative flex items-center h-full transition-colors duration-200 ease-out focus:outline-none hover:text-ui-fg-base"
                >
                  <div className="p-2 rounded-full hover:bg-zinc-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
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
                <PopoverPanel className="absolute inset-x-0 z-30 flex flex-col w-full h-screen pr-4 m-0 overflow-hidden text-sm sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min text-secondary-sm-darker backdrop-blur-2xl">
                  <div
                    data-testid="admin-nav-menu-popup"
                    className="flex flex-col justify-between h-full p-6 overflow-hidden bg-light-sm"
                  >
                    <div className="absolute pointer-events-none right-2 opacity-15 bottom-2">
                      <SantaMonicaIcon size={750} />
                    </div>
                    <div className="flex items-center justify-between" id="admin-header">
                      <div>
                        <h2 className="text-xl font-lemonMilk text-secondary-sm">
                          Santa Mónica
                        </h2>
                        <p className="mt-1 text-sm text-grey-sm">
                          Panel de administrador
                        </p>
                      </div>
                      <button data-testid="close-admin-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col items-start justify-start gap-6 font-lemonMilk">
                      {Object.entries(menuItems).map(([_name, item]) => {
                        return (
                          <li key={item.name}>
                            <LocalizedClientLink
                              href={item.href}
                              className="flex items-center gap-3 text-3xl leading-10 hover:text-ui-fg-disabled"
                              onClick={close}
                              data-testid={`admin-${item.name.toLowerCase()}-link`}
                            >
                              {getMenuIcon(item.name)}
                              {item.name}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div className="pt-4 border-t border-grey-sm-lighter">
                        <Text className="text-xs text-grey-sm">
                          Panel de administración
                        </Text>
                        <Text className="text-xs text-grey-sm-darker">
                          Gestiona tu restaurante
                        </Text>
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

// Helper function to get icons for menu items
const getMenuIcon = (itemName: string) => {
  switch (itemName) {
    case "Dashboard":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case "Menús":
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case "Administradores":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                  <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                </svg>
      )
    case "Ajustes":
      return (
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                </svg>
      )
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
  }
}

export default AdminSideMenu