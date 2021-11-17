# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.0] - 2021-11-17

### Added
- Arabic translation.

## [0.8.0] - 2021-04-26

### Added
- New translations.

### Changed
- Crowdin configuration file.

## [0.7.3] - 2021-03-25
### Fixed
- `PickupDetailsModal` displays the store location instead of the user own location.

## [0.7.2] - 2021-02-23
### Changed
- Updated geolocation condition to use `useGeolocationEnabled` hook from `checkout-resources`.

## [0.7.1] - 2021-02-19
### Changed
- Use `useAddressRules` hook from `address-context` instead of defining our own.

## [0.7.0] - 2021-02-19
### Changed
- Extracted address states from `ShippingForm` to new `ShippingAddress` component.

### Fixed
- Duplicate addresses inserted into orderForm when editing an address.

## [0.6.6] - 2021-01-29
### Changed
- Upgrade `xstate` and `@xstate/react` to newest version.

## [0.6.5] - 2021-01-07
### Fixed
- Make default value for `addressRules` to be `undefined`.

## [0.6.4] - 2020-12-17

## [0.6.3] - 2020-12-11
### Added
- `id` to the elements needed in order to make e2e tests.

## [0.6.2] - 2020-12-11
### Fixed
- Unnecessary top margin when `LocationCountry` component is not rendered.

### Changed 
- `PickupDetailsModal` to use the `Modal` from the `vtex.checkout-components`.

## [0.6.1] - 2020-12-07
### Fixed
- Border on selected SLAs list.

## [0.6.0] - 2020-12-03
### Added
- Pickup points to the list of available shipping options.
- Modal with details about a given pickup point.

## [0.5.1] - 2020-11-19
### Fixed
- Border on selected SLAs list.

## [0.5.0] - 2020-11-19
### Added
- Use `LocationSearch` component from `vtex.place-components` on `NewAddressForm` if `vtex.geolocation-graphql-interface` app is used on workspace.

## [0.4.1] - 2020-11-04
### Fixed
- `ShippingHeader` validating address even if it is masked.

## [0.4.0] - 2020-11-04
### Added
- Components `ShippingHeader`, `ShippingOptionList`, `ShippingOption` and expose `useAddressRules` hook.

## [0.3.1] - 2020-07-15
### Fixed
- Editable fields in complete address step are now consistent when the user proceeds to payment and then returns to this step.

## [0.3.0] - 2020-07-13
### Added
- Support for disposable addresses.

### Changed
- Request for user login when editing the address receiver name on a
  identified but not authenticated session.

## [0.2.3] - 2020-07-10
### Fixed
- User can no longer advance from the complete address step if there are invalid fields.

### Changed
- Display mode of address in SLA selection step to `minimal` if it is new and incomplete.
- User is sent to payment step after editing receiver name.
- The step the user is sent to when clicking the edit address button on the SLA selection step changes depending on whether it is a first/second purchase and whether the current address is complete or not.

## [0.2.2] - 2020-07-10
### Added
- Shipping address on receiver name input screen.

## [0.2.1] - 2020-07-09
### Fixed
- Added `onSuccess` prop on DeviceCoordinate instance in NewAddressForm.

## [0.2.0] - 2020-07-01
### Changed
- Fetch rules from `vtex.country-data-settings` and pass them to `address-context`.

## [0.1.2] - 2020-06-02
### Added
- Button in "complete your address" sub-step to edit the postal code.

### Fixed
- Fastest delivery option not highlighted.
- Shipping option translation in portuguese.
- Receiver name checkbox not working by clicking on the text.
- User not redirected to "create address" from "select address" state when
  they didn't had any available addresses.

## [0.1.1] - 2020-05-21
### Fixed
- Address created with either `addressType` or `receiverName` equal to `null`.

## [0.1.0] - 2020-05-06
### Added
- Implementation for `ShippingSummary` and `ShippingForm` components.
