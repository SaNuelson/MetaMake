import React, { ReactNode, useState } from 'react'
import {
  TEModal,
  TEModalBody,
  TEModalContent,
  TEModalDialog,
  TEModalFooter,
  TEModalHeader,
  TERipple
} from 'tw-elements-react'

type ModalButtonConfig = {
  text: string
  onClick: () => boolean
}

type Props = {
  title?: string
  isShown?: boolean
  setIsShown: (isShown: boolean) => void

  hasCloseButton?: boolean
  onClose?: () => boolean

  buttonConfig?: Array<ModalButtonConfig>

  children?: ReactNode
}

export default function Modal({
  title = "Modal",
  isShown = false,
  setIsShown,
  hasCloseButton = true,
  onClose = () => true,
  children = [],
  buttonConfig = [{text: "OK", onClick: () => true}]
}: Props): React.JSX.Element {

  return (
    <div>
      <TEModal show={isShown} setShow={setIsShown}>
        <TEModalDialog>
          <TEModalContent>
            <TEModalHeader>
              <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                {title}
              </h5>
              { hasCloseButton &&
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  onClick={() => onClose() || setIsShown(false)}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </TEModalHeader>
            <TEModalBody>
              {children}
            </TEModalBody>
            <TEModalFooter>
              {buttonConfig.map(cfg =>
                <TERipple
                  key={cfg.text}
                  rippleColor="light">
                  <button
                    type="button"
                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                    onClick={() => cfg.onClick() && setIsShown(false)}
                  >
                    {cfg.text}
                  </button>
                </TERipple>
              )}
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  )
}
