# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
