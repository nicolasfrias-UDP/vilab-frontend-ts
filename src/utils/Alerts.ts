import { Dialog, Notify } from 'quasar'

function confirmDialog (callback: () => void, title: any, message: any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  Dialog.create({
    title: title,
    class: 'text-caption text-black',
    cancel: {
      push: true,
      label: 'Cancelar',
      color: 'grey'
    },
    ok: {
      push: true,
      label: 'Aceptar',
      color: 'black'
    },
    html: true,
    message: message,
    focus: 'cancel',
    persistent: true
  }).onOk(() => {
    callback()
  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function dangerDialog (callback: () => void, title: any, message: any) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Dialog.create({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    title: title,
    class: 'text-caption text-grey-8',
    ok: {
      push: true,
      label: 'Aceptar',
      color: 'blue'
    },
    focus: 'cancel',
    message: message,
    html: true,
    color: 'red',
    persistent: true
  }).onOk(() => {
    callback()
  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function messageNotification (caption: string, message: string, color = 'blue', textColor = 'white', position = undefined) {
  Notify.create({
    color,
    textColor,
    message,
    caption,
    html: true,
    position: position,
    multiLine: true,
    timeout: Math.random() * 2000 + 2000
  })
}

export { confirmDialog, dangerDialog, messageNotification }
