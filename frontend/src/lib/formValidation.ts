import {ModalTypesENUM} from "@models/modals"

export const isValidDefaultValue = (values: string, inputType: ModalTypesENUM) => {
    if (["roiName", "shelfInfo"].includes(inputType)){
        const regexp = /^\S+$/
        if (regexp.test(values)) return true
    } else if (["roiGenInputParams", "pointPairDist"].includes(inputType)){
        const regexp = /^[0-9]+$/
        if (regexp.test(values)) return true
    }
    return false
}

export const isValidText = (values: string) => {
    const regexp = /^\S+$/
    if (regexp.test(values)) return true;
    return false
}

export const isValidNumber = (values: string) => {
    const regexp = /^[0-9]+$/
    if (regexp.test(values)) return true;
    return false
}