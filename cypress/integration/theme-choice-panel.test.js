/// <reference types="cypress" />
{lang==="en" ? 
cy.contains("Choose your preferred Theme.").click() : lang==="fr" ? 
cy.contains("Choisissez votre thème préféré.").click() : lang==="hi" ? 
cy.contains("अपनी पसंदीदा थीम चुनें").click() : lang==="es" ?
cy.contains("Elige tu tema preferido.").click() : cy.contains("No language chosen")

}