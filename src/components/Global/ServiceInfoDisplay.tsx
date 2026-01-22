import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontFamily } from '../../theme/typography';

interface ServiceInfoDisplayProps {
  serviceInfo: any;
  category: string;
}

const ServiceInfoDisplay: React.FC<ServiceInfoDisplayProps> = ({ serviceInfo, category }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleExpansion = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  
  const categoryConfig = {
    catering: {
      name: 'Catering Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price (Per Plate)',
          icon: require('../../assets/images/vendor/cateringStartingPrice.png'),
          render: () => formatPricing(serviceInfo.vegPlatePrice, serviceInfo.nonVegPlatePrice)
        },
        {
          key: 'capacity',
          title: 'Capacity',
          icon: require('../../assets/images/vendor/cateringCapacity.png'),
          render: () => formatCapacity(serviceInfo.minPeople, serviceInfo.maxPeople)
        },
        {
          key: 'cuisines',
          title: 'Cuisines Offered',
          icon: require('../../assets/images/vendor/cateringCusines.png'),
          render: () => formatCuisines(serviceInfo.cuisines, 'catering-cuisines')
        },
        {
          key: 'type',
          title: 'Caterer Type',
          icon: require('../../assets/images/vendor/CateringType.png'),
          render: () => getCatererType()
        },
        {
          key: 'booking',
          title: 'Booking & Cancellation',
          icon: require('../../assets/images/vendor/catering-Booking-Cancellation.png'),
          render: () => formatBookingPolicy()
        },
        {
          key: 'established',
          title: 'Established In',
          icon: require('../../assets/images/vendor/cateringEstablished.png'),
          render: () => serviceInfo.startYear ? `Established in ${serviceInfo.startYear}` : null
        }
      ]
    },
    photography: {
      name: 'Photography Services',
      sections: [
        {
          key: 'package',
          title: 'Popular Package Price',
          icon: require('../../assets/images/vendor/photoPrice.png'),
          render: () => formatPhotographyPackage()
        },
        {
          key: 'included',
          title: 'What\'s Included (Package Coverage)',
          icon: require('../../assets/images/vendor/photoIncluded.png'),
          render: () => serviceInfo.serviceType
        },
        {
          key: 'services',
          title: 'Other Services Offered',
          icon: require('../../assets/images/vendor/photoOtherService.png'),
          render: () => formatCuisines(serviceInfo.selectedServices, 'photography-services')
        },
        {
          key: 'deliverables',
          title: 'Deliverables',
          icon: require('../../assets/images/vendor/photoDeliver.png'),
          render: () => formatDeliverables()
        },
        {
          key: 'leadtime',
          title: 'Booking Lead Time',
          icon: require('../../assets/images/vendor/photoLead.png'),
          render: () => serviceInfo.advanceWeeks ? `Book ${serviceInfo.advanceWeeks} weeks in advance` : null
        }
      ]
    },
    venues: {
      name: 'Venue Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price (Veg / Non-Veg)',
          icon: require('../../assets/images/vendor/venueStarting.png'),
          render: () => formatVenuePricing(serviceInfo.vegetarianMenuPrice, serviceInfo.nonVegetarianMenuPrice)
        },
        {
          key: 'venueType',
          title: 'Venue Type & Spaces',
          icon: require('../../assets/images/vendor/venueTypes.png'),
          render: () => formatVenueTypeAndSpaces()
        },
        {
          key: 'accommodation',
          title: 'Accommodation',
          icon: require('../../assets/images/vendor/venueAccomodation.png'),
          render: () => formatAccommodation()
        },
        {
          key: 'catering',
          title: 'Catering Policy',
          icon: require('../../assets/images/vendor/venue-Booking-Cancellation.png'),
          render: () => serviceInfo.cateringPolicy
        },
        {
          key: 'policies',
          title: 'Décor & DJ Policy',
          icon: require('../../assets/images/vendor/venueServices.png'),
          render: () => formatPolicies()
        },
        {
          key: 'booking',
          title: 'Booking & Cancellation',
          icon: require('../../assets/images/vendor/venueCancellation.png'),
          render: () => formatVenueBookingPolicy()
        }
      ]
    },
    decorators: {
      name: 'Decorator Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price',
          icon: require('../../assets/images/vendor/decoratorStartingPrice.png'),
          render: () => formatDecoratorPricing()
        },
        {
          key: 'specialties',
          title: 'Décor Specialties',
          icon: require('../../assets/images/vendor/DecorSpecialties.png'),
          render: () => formatCuisines(serviceInfo.decorServices, 'decorators-specialties')
        },
        {
          key: 'expertise',
          title: 'Event Expertise',
          icon: require('../../assets/images/vendor/EventExpertise.png'),
          render: () => serviceInfo.mostExperienced
        },
        {
          key: 'experience',
          title: 'Experience',
          icon: require('../../assets/images/vendor/decoratorExperience.png'),
          render: () => formatDecoratorExperience()
        },
        {
          key: 'leadtime',
          title: 'Booking Lead Time',
          icon: require('../../assets/images/vendor/decoratorBookingLeadTime.png'),
          render: () => serviceInfo.advanceBookingWeeks ? `Book ${serviceInfo.advanceBookingWeeks} weeks in advance` : null
        },
        {
          key: 'cancellation',
          title: 'Cancellation Policy',
          icon: require('../../assets/images/vendor/decoratorCancellationPolicy.png'),
          render: () => formatDecoratorCancellationPolicy()
        }
      ]
    },
    bridalmakeup: {
      name: 'Bridal Makeup Services',
      sections: [
        {
          key: 'pricing',
          title: 'Bridal Makeup Price',
          icon: require('../../assets/images/vendor/BridalMakeupPrice.png'),
          render: () => formatBridalMakeupPricing()
        },
        {
          key: 'included',
          title: 'What\'s Included',
          icon: require('../../assets/images/vendor/bridalWhatsIncluded.png'),
          render: () => formatCuisines(serviceInfo.makeupPriceIncludes, 'bridal-included')
        },
        {
          key: 'services',
          title: 'Services Offered',
          icon: require('../../assets/images/vendor/bridalServicesOffered.png'),
          render: () => formatCuisines(serviceInfo.services, 'bridal-services')
        },
        {
          key: 'travel',
          title: 'Travel & Destination',
          icon: require('../../assets/images/vendor/bridalTravelDestination.png'),
          render: () => formatTravelInfo()
        },
        {
          key: 'leadtime',
          title: 'Booking Lead Time',
          icon: require('../../assets/images/vendor/bridalBookingLeadTime.png'),
          render: () => serviceInfo.bookingWeeks ? `Book ${serviceInfo.bookingWeeks} weeks in advance` : null
        }
      ]
    },
    'wedding-planners': {
      name: 'Wedding Planning Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price & Avg. Package',
          icon: require('../../assets/images/vendor/wedPlannerStartingPrice.png'),
          render: () => formatWeddingPlannerPricing()
        },
        {
          key: 'feeStructure',
          title: 'Fee Structure',
          icon: require('../../assets/images/vendor/wedplannerFeeStructure.png'),
          render: () => serviceInfo.commercialType
        },
        {
          key: 'cities',
          title: 'Key Cities',
          icon: require('../../assets/images/vendor/wedplannerKeyCities.png'),
          render: () => formatKeyCities()
        },
        {
          key: 'services',
          title: 'Included Services',
          icon: require('../../assets/images/vendor/wedplannerIncludedServices.png'),
          render: () => formatCuisines(serviceInfo.includedServices, 'wedding-planner-services')
        },
        {
          key: 'established',
          title: 'Established',
          icon: require('../../assets/images/vendor/wedplannerEstablised.png'),
          render: () => formatWeddingPlannerExperience()
        },
        {
          key: 'cancellation',
          title: 'Cancellation Policy',
          icon: require('../../assets/images/vendor/wedplannerCancellationPolicy.png'),
          render: () => formatWeddingPlannerCancellationPolicy()
        }
      ]
    },
    'mehendi-artist': {
      name: 'Mehendi Artist Services',
      sections: [
        {
          key: 'pricing',
          title: 'Bridal Mehendi (Both Hands)',
          icon: require('../../assets/images/vendor/BridalMehendi.png'),
          render: () => serviceInfo.mehendiPrice ? `₹${serviceInfo.mehendiPrice}` : "Contact for Pricing"
        },
        {
          key: 'specialties',
          title: 'Design Specialties',
          icon: require('../../assets/images/vendor/cakeSpecialties.png'),
          render: () => formatMehandiSpecialties()
        },
        {
          key: 'capacity',
          title: 'Capacity',
          icon: require('../../assets/images/vendor/mehendiCapacity.png'),
          render: () => serviceInfo.maxGuestsPerHour ? `Up to ${serviceInfo.maxGuestsPerHour} Guests/Hour` : null
        },
        {
          key: 'experience',
          title: 'Experience',
          icon: require('../../assets/images/vendor/djExperience.png'),
          render: () => formatMehandiExperience()
        },
        {
          key: 'cancellation',
          title: 'Cancellation Policy',
          icon: require('../../assets/images/vendor/wedplannerCancellationPolicy.png'),
          render: () => formatMehandiCancellationPolicy()
        }
      ]
    },
    dj: {
      name: 'DJ Services',
      sections: [
        {
          key: 'package',
          title: 'Starting Package',
          icon: require('../../assets/images/vendor/djGroup.png'),
          render: () => formatDJPackage()
        },
        {
          key: 'genres',
          title: 'Music Genres',
          icon: require('../../assets/images/vendor/djMusicGenres.png'),
          render: () => formatCuisines(serviceInfo.selectedGenres, 'dj-genres')
        },
        {
          key: 'experience',
          title: 'Experience',
          icon: require('../../assets/images/vendor/djExperience.png'),
          render: () => formatDJExperience()
        },
        {
          key: 'club',
          title: 'Club Affiliation',
          icon: require('../../assets/images/vendor/djClubAffiliation.png'),
          render: () => serviceInfo.clubName ? `Resident DJ at ${serviceInfo.clubName}` : null
        },
        {
          key: 'booking',
          title: 'Booking Requirement',
          icon: require('../../assets/images/vendor/djBookingRequirement.png'),
          render: () => formatDJBookingRequirement()
        }
      ]
    },
    'pre-wedding-photographers': {
      name: 'Pre-Wedding Photography Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price (Per Day)',
          icon: require('../../assets/images/vendor/preWeddingStartingPrice.png'),
          render: () => formatPreWeddingPricing()
        },
        {
          key: 'services',
          title: 'Services Offered',
          icon: require('../../assets/images/vendor/preweddingServicesOffered.png'),
          render: () => formatCuisines(serviceInfo.services, 'pre-wedding-services')
        },
        {
          key: 'deliverables',
          title: 'Deliverables',
          icon: require('../../assets/images/vendor/preweddingDeliverables.png'),
          render: () => serviceInfo.processedPics ? `${serviceInfo.processedPics} Edited Photos Delivered` : null
        },
        {
          key: 'travel',
          title: 'Travel & Location Fees',
          icon: require('../../assets/images/vendor/preweddingTravelLocationFees.png'),
          render: () => formatPreWeddingTravel()
        },
        {
          key: 'experience',
          title: 'Experience & Awards',
          icon: require('../../assets/images/vendor/preweddingExperienceAwards.png'),
          render: () => formatPreWeddingExperience()
        }
      ]
    },
    'wedding-pandit': {
      name: 'Wedding Pandit Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price (Wedding Puja/Hawan)',
          icon: require('../../assets/images/vendor/panditStartingPrice.png'),
          render: () => serviceInfo.weddingCharges ? `₹${serviceInfo.weddingCharges}` : "Contact for Pricing"
        },
        {
          key: 'ritualCharges',
          title: 'Other Ritual Charges',
          icon: require('../../assets/images/vendor/panditOtherRitualCharges.png'),
          render: () => formatRitualCharges()
        },
        {
          key: 'services',
          title: 'Services Offered',
          icon: require('../../assets/images/vendor/panditServicesOffered.png'),
          render: () => formatCuisines(serviceInfo.services, 'pandit-services')
        },
        {
          key: 'travel',
          title: 'Travel for Destination Weddings',
          icon: require('../../assets/images/vendor/panditTravelDestinationWeddings.png'),
          render: () => formatPanditTravel()
        },
        {
          key: 'languages',
          title: 'Languages',
          icon: require('../../assets/images/vendor/panditLanguages.png'),
          render: () => formatCuisines(serviceInfo.languages, 'pandit-languages')
        },
        {
          key: 'experience',
          title: 'Experience',
          icon: require('../../assets/images/vendor/panditExperience.png'),
          render: () => formatPanditExperience()
        }
      ]
    },
    cake: {
      name: 'Cake Services',
      sections: [
        {
          key: 'pricing',
          title: 'Base Price (per kg)',
          icon: require('../../assets/images/vendor/cakeBasePrice.png'),
          render: () => serviceInfo.startingPrice ? `₹${serviceInfo.startingPrice}/kg` : "Contact for Pricing"
        },
        {
          key: 'specialties',
          title: 'Specialties',
          icon: require('../../assets/images/vendor/cakeSpecialties.png'),
          render: () => formatCuisines(serviceInfo.specializations, 'cake-specialties')
        },
        {
          key: 'flavors',
          title: 'Top Flavors',
          icon: require('../../assets/images/vendor/cakeTopFlavors.png'),
          render: () => formatCakeFlavors()
        },
        {
          key: 'delivery',
          title: 'Delivery & Setup',
          icon: require('../../assets/images/vendor/cakeDeliverySetup.png'),
          render: () => formatCakeDelivery()
        },
        {
          key: 'availability',
          title: 'Availability',
          icon: require('../../assets/images/vendor/cakeAvailability.png'),
          render: () => serviceInfo.availability
        },
        {
          key: 'booking',
          title: 'Booking Requirement',
          icon: require('../../assets/images/vendor/cakeBookingRequirement.png'),
          render: () => serviceInfo.advanceBookingDays ? `Book ${serviceInfo.advanceBookingDays}+ Days in Advance` : null
        }
      ]
    },
    bartenders: {
      name: 'Bartender Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price (200 Guests)',
          icon: require('../../assets/images/vendor/bartenderStartingPrice.png'),
          render: () => serviceInfo.chargesFor200 ? `₹${serviceInfo.chargesFor200}` : "Contact for Pricing"
        },
        {
          key: 'teamSize',
          title: 'Team Size',
          icon: require('../../assets/images/vendor/bartenderTeamSize.png'),
          render: () => serviceInfo.bartendersProvided ? `${serviceInfo.bartendersProvided} Bartenders` : null
        },
        {
          key: 'types',
          title: 'Types Available',
          icon: require('../../assets/images/vendor/bartenderTypesAvailable.png'),
          render: () => formatCuisines(serviceInfo.bartenderTypes, 'bartender-types')
        },
        {
          key: 'services',
          title: 'Services Included',
          icon: require('../../assets/images/vendor/bartenderServicesIncluded.png'),
          render: () => formatCuisines(serviceInfo.servicesOffered, 'bartender-services')
        },
        {
          key: 'availability',
          title: 'Availability',
          icon: require('../../assets/images/vendor/bartenderAvailability.png'),
          render: () => serviceInfo.availability
        },
        {
          key: 'experience',
          title: 'Experience / Established',
          icon: require('../../assets/images/vendor/bartenderEstablished.png'),
          render: () => formatBartenderExperience()
        }
      ]
    },
    jewellery: {
      name: 'Jewellery Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Price (Bridal Sets)',
          icon: require('../../assets/images/vendor/jewellery/jewellery-StartingPrice.png'),
          render: () => formatJewelleryPricing()
        },
        {
          key: 'customization',
          title: 'Customization Availability',
          icon: require('../../assets/images/vendor/jewellery/jewellery-Customization-Availability.png'),
          render: () => formatJewelleryCustomization()
        },
        {
          key: 'rental',
          title: 'Rental Option',
          icon: require('../../assets/images/vendor/jewellery/jewellery-RentalOption.png'),
          render: () => formatJewelleryRental()
        },
        {
          key: 'businessType',
          title: 'Business Type',
          icon: require('../../assets/images/vendor/jewellery/jewellery-BusinessType.png'),
          render: () => formatCuisines(serviceInfo.businessType, 'jewellery-business')
        },
        {
          key: 'specialty',
          title: 'Specialty',
          icon: require('../../assets/images/vendor/jewellery/jewellery-Specialty.png'),
          render: () => formatCuisines(serviceInfo.jewellerySpecialty, 'jewellery-specialty')
        }
      ]
    },
    'groom-wear': {
      name: 'Groom Wear Services',
      sections: [
        {
          key: 'outfitTypes',
          title: 'Outfit Types Offered',
          icon: require('../../assets/images/vendor/groom-wear/groom-wear-OutfitTypes.png'),
          render: () => formatCuisines(serviceInfo.offeredItems, 'groom-outfit-types')
        },
        {
          key: 'pricing',
          title: 'Price Range',
          icon: require('../../assets/images/vendor/groom-wear/groom-wear-Price-Range.png'),
          render: () => formatGroomWearPricing()
        },
        {
          key: 'orderType',
          title: 'Order Type',
          icon: require('../../assets/images/vendor/groom-wear/groom-wear-OrderType.png'),
          render: () => formatGroomOrderType()
        },
        {
          key: 'shipping',
          title: 'Shipping Availability',
          icon: require('../../assets/images/vendor/groom-wear/groom-wear-ShippingAvailability.png'),
          render: () => formatGroomShipping()
        },
        {
          key: 'customization',
          title: 'Customization & Lead Time',
          icon: require('../../assets/images/vendor/groom-wear/groom-wear-Customization-LeadTime.png'),
          render: () => formatGroomCustomization()
        },
        {
          key: 'storeType',
          title: 'Store Type',
          icon: require('../../assets/images/vendor/groom-wear/groom-wear-StoreType.png'),
          render: () => serviceInfo.storeType
        }
      ]
    },
    'bridal-wear': {
      name: 'Bridal Wear Services',
      sections: [
        {
          key: 'outfitTypes',
          title: 'Outfit Types Offered',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-OutfitTypesOffered.png'),
          render: () => formatCuisines(serviceInfo.offeredOutfits, 'bridal-outfit-types')
        },
        {
          key: 'knownFor',
          title: 'Most Known For',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-MostKnownFor.png'),
          render: () => formatBridalKnownFor()
        },
        {
          key: 'orderType',
          title: 'Order Type',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-OrderType.png'),
          render: () => formatBridalOrderType()
        },
        {
          key: 'customization',
          title: 'Customization & Production Time',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-Customization-LeadTime.png'),
          render: () => formatBridalCustomization()
        },
        {
          key: 'shipping',
          title: 'Shipping Availability',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-ShippingAvailability.png'),
          render: () => formatBridalShipping()
        },
        {
          key: 'storeType',
          title: 'Store Type & Establishment',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-StoreType.png'),
          render: () => formatBridalStoreType()
        },
        {
          key: 'availability',
          title: 'Outfit Availability',
          icon: require('../../assets/images/vendor/bridal-wear/bridal-wear-OutfitAvailability.png'),
          render: () => formatBridalOutfitAvailability()
        }
      ]
    },
    astrology: {
      name: 'Astrology Services',
      sections: [
        {
          key: 'pricing',
          title: 'Starting Consultation Charge',
          icon: require('../../assets/images/vendor/astrology/astrology-Starting-ConsultationCharge.png'),
          render: () => formatAstrologyPricing()
        },
        {
          key: 'services',
          title: 'Services Offered',
          icon: require('../../assets/images/vendor/astrology/astrology-ServicesOffered.png'),
          render: () => formatCuisines(serviceInfo.servicesOffered, 'astrology-services')
        },
        {
          key: 'experience',
          title: 'Experience',
          icon: require('../../assets/images/vendor/astrology/astrology-Experience.png'),
          render: () => formatAstrologyExperience()
        },
        {
          key: 'consultation',
          title: 'Consultation Mode & Duration',
          icon: require('../../assets/images/vendor/astrology/astrology-ConsultationModeDuration.png'),
          render: () => formatAstrologyConsultation()
        },
        {
          key: 'reports',
          title: 'Reports & Remedies',
          icon: require('../../assets/images/vendor/astrology/astrology-Reports-Remedies.png'),
          render: () => formatAstrologyReports()
        },
        {
          key: 'languages',
          title: 'Languages & Travel',
          icon: require('../../assets/images/vendor/astrology/astrology-Languages-Travel.png'),
          render: () => formatAstrologyLanguages()
        },
        {
          key: 'booking',
          title: 'Booking & Cancellation Policy',
          icon: require('../../assets/images/vendor/astrology/astrology-Booking-Cancellation-Policy.png'),
          render: () => formatAstrologyBooking()
        },
        {
          key: 'recognition',
          title: 'Recognition & Approach',
          icon: require('../../assets/images/vendor/astrology/astrology-Recognition-Approach.png'),
          render: () => formatAstrologyRecognition()
        }
      ]
    }
  };

  // Helper functions
  const formatPricing = (vegPrice: any, nonVegPrice: any) => {
    if (!vegPrice && !nonVegPrice) return "Contact for Pricing";
    if (vegPrice && nonVegPrice) {
      return `Veg: ₹${vegPrice} | Non-Veg: ₹${nonVegPrice}`;
    }
    return vegPrice ? `Veg: ₹${vegPrice}` : `Non-Veg: ₹${nonVegPrice}`;
  };

  const formatCapacity = (min: any, max: any) => {
    if (!min && !max) return null;
    if (min && max) return `Min. ${min} – Up to ${max} guests`;
    if (max) return `Up to ${max} guests`;
    if (min) return `Min. ${min} guests`;
  };

  const formatCuisines = (items: any[], sectionKey: string = 'default') => {
    if (!items || items.length === 0) return null;
    if (items.length <= 3) return items.join(', ');
    
    const isExpanded = expandedSections[sectionKey];
    const visible = isExpanded ? items : items.slice(0, 3);
    const remainingCount = items.length - 3;
    
    return (
      <View style={styles.cuisineContainer}>
        <Text style={styles.infoValue}>{visible?.join(', ')}</Text>
        {!isExpanded && (
          <TouchableOpacity onPress={() => toggleExpansion(sectionKey)}>
            <Text style={styles.expandText}> +{remainingCount} more</Text>
          </TouchableOpacity>
        )}
        {isExpanded && (
          <TouchableOpacity onPress={() => toggleExpansion(sectionKey)}>
            <Text style={styles.expandText}> see less</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getCatererType = () => {
    if (serviceInfo.categories && serviceInfo.categories.length > 0) {
      return serviceInfo.categories.join(', ');
    }
    if (serviceInfo.catererType) {
      return serviceInfo.catererType;
    }
    if (serviceInfo.vegCategory) {
      return serviceInfo.vegCategory;
    }
    return null;
  };

  const formatBookingPolicy = () => {
    const parts = [];
    if (serviceInfo.advanceWeeks) {
      parts.push(`Book ${serviceInfo.advanceWeeks} weeks in advance`);
    }
    if (serviceInfo.userCancellationPolicy) {
      parts.push(`Client Cancel → ${serviceInfo.userCancellationPolicy}`);
    }
    if (serviceInfo.vendorCancellationPolicy) {
      parts.push(`Vendor Cancel → ${serviceInfo.vendorCancellationPolicy}`);
    }
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatPhotographyPackage = () => {
    const price = serviceInfo.mostBookedValue;
    const days = serviceInfo.serviceDays;
    
    if (!price) return "Contact for Pricing";
    if (price && days) return `₹${price} (${days} Coverage)`;
    if (price) return `₹${price} (Contact for days)`;
    return "Contact for Pricing";
  };

  const formatDeliverables = () => {
    const images = serviceInfo.imageDeliveryCount;
    const delivery = serviceInfo.deliveryWeeks;
    
    if (!images && !delivery) return null;
    if (images && delivery) return `${images} Edited Photos | Delivery in ${delivery}`;
    if (images) return `${images} Edited Photos`;
    if (delivery) return `Delivery in ${delivery}`;
  };

  // Additional helper functions for all categories
  const formatVenuePricing = (vegPrice: any, nonVegPrice: any) => {
    if (!vegPrice && !nonVegPrice) return "Contact for Pricing";
    if (vegPrice && nonVegPrice) return `Veg: ₹${vegPrice} | Non-Veg: ₹${nonVegPrice}`;
    return vegPrice ? `Veg: ₹${vegPrice}` : `Non-Veg: ₹${nonVegPrice}`;
  };

  const formatVenueTypeAndSpaces = () => {
    const parts = [];
    if (serviceInfo.venueType) parts.push(serviceInfo.venueType);
    if (serviceInfo.spaces) parts.push(`Spaces: ${serviceInfo.spaces.join(', ')}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatAccommodation = () => {
    if (serviceInfo.accommodationAvailable === 'Yes') {
      return serviceInfo.accommodationRooms ? `${serviceInfo.accommodationRooms} Rooms Available` : 'Available';
    }
    return serviceInfo.accommodationAvailable === 'No' ? 'Not Available' : null;
  };

  const formatPolicies = () => {
    const parts = [];
    if (serviceInfo.decorPolicy) parts.push(`Décor: ${serviceInfo.decorPolicy}`);
    if (serviceInfo.djPolicy) parts.push(`DJ: ${serviceInfo.djPolicy}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatVenueBookingPolicy = () => {
    const parts = [];
    if (serviceInfo.advanceBookingMonths) parts.push(`Book ${serviceInfo.advanceBookingMonths} months in advance`);
    if (serviceInfo.cancellationPolicy) parts.push(`Cancellation: ${serviceInfo.cancellationPolicy}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatDecoratorPricing = () => {
    if (serviceInfo.startingPrice) return `₹${serviceInfo.startingPrice}`;
    if (serviceInfo.minBudget && serviceInfo.maxBudget) return `₹${serviceInfo.minBudget} - ₹${serviceInfo.maxBudget}`;
    return "Contact for Pricing";
  };

  const formatDecoratorExperience = () => {
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    if (serviceInfo.startYear) return `Since ${serviceInfo.startYear}`;
    return null;
  };

  const formatDecoratorCancellationPolicy = () => {
    return serviceInfo.cancellationPolicy || null;
  };

  const formatBridalMakeupPricing = () => {
    if (serviceInfo.bridalMakeupPrice) return `₹${serviceInfo.bridalMakeupPrice}`;
    return "Contact for Pricing";
  };

  const formatTravelInfo = () => {
    const parts = [];
    if (serviceInfo.travelCharges) parts.push(`Travel: ₹${serviceInfo.travelCharges}`);
    if (serviceInfo.destinationWedding) parts.push(`Destination: ${serviceInfo.destinationWedding}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatWeddingPlannerPricing = () => {
    const parts = [];
    if (serviceInfo.startingPrice) parts.push(`Starting: ₹${serviceInfo.startingPrice}`);
    if (serviceInfo.averagePackage) parts.push(`Avg: ₹${serviceInfo.averagePackage}`);
    return parts.length > 0 ? parts.join(' | ') : "Contact for Pricing";
  };

  const formatKeyCities = () => {
    if (serviceInfo.keyCities && serviceInfo.keyCities.length > 0) {
      return serviceInfo.keyCities.join(', ');
    }
    return null;
  };

  const formatWeddingPlannerExperience = () => {
    if (serviceInfo.establishedYear) return `Established in ${serviceInfo.establishedYear}`;
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    return null;
  };

  const formatWeddingPlannerCancellationPolicy = () => {
    return serviceInfo.cancellationPolicy || null;
  };

  const formatMehandiSpecialties = () => {
    if (serviceInfo.designSpecialties && serviceInfo.designSpecialties.length > 0) {
      return formatCuisines(serviceInfo.designSpecialties, 'mehendi-specialties');
    }
    return null;
  };

  const formatMehandiExperience = () => {
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    return null;
  };

  const formatMehandiCancellationPolicy = () => {
    return serviceInfo.cancellationPolicy || null;
  };

  const formatDJPackage = () => {
    if (serviceInfo.startingPrice) return `₹${serviceInfo.startingPrice}`;
    return "Contact for Pricing";
  };

  const formatDJExperience = () => {
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    return null;
  };

  const formatDJBookingRequirement = () => {
    if (serviceInfo.advanceBookingDays) return `Book ${serviceInfo.advanceBookingDays} days in advance`;
    return null;
  };

  const formatPreWeddingPricing = () => {
    if (serviceInfo.pricePerDay) return `₹${serviceInfo.pricePerDay}/day`;
    return "Contact for Pricing";
  };

  const formatPreWeddingTravel = () => {
    const parts = [];
    if (serviceInfo.travelCharges) parts.push(`Travel: ₹${serviceInfo.travelCharges}`);
    if (serviceInfo.locationFees) parts.push(`Location: ₹${serviceInfo.locationFees}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatPreWeddingExperience = () => {
    const parts = [];
    if (serviceInfo.experienceYears) parts.push(`${serviceInfo.experienceYears} Years`);
    if (serviceInfo.awards) parts.push(`Awards: ${serviceInfo.awards}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatRitualCharges = () => {
    const parts = [];
    if (serviceInfo.engagementCharges) parts.push(`Engagement: ₹${serviceInfo.engagementCharges}`);
    if (serviceInfo.havanCharges) parts.push(`Havan: ₹${serviceInfo.havanCharges}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatPanditTravel = () => {
    if (serviceInfo.destinationWeddingTravel === 'Yes') {
      return serviceInfo.travelCharges ? `Available (₹${serviceInfo.travelCharges})` : 'Available';
    }
    return serviceInfo.destinationWeddingTravel === 'No' ? 'Not Available' : null;
  };

  const formatPanditExperience = () => {
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    return null;
  };

  const formatCakeFlavors = () => {
    if (serviceInfo.topFlavors && serviceInfo.topFlavors.length > 0) {
      return formatCuisines(serviceInfo.topFlavors, 'cake-flavors');
    }
    return null;
  };

  const formatCakeDelivery = () => {
    const parts = [];
    if (serviceInfo.deliveryAvailable === 'Yes') parts.push('Delivery Available');
    if (serviceInfo.setupService === 'Yes') parts.push('Setup Service');
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatBartenderExperience = () => {
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    if (serviceInfo.establishedYear) return `Established in ${serviceInfo.establishedYear}`;
    return null;
  };

  const formatJewelleryPricing = () => {
    if (serviceInfo.bridalSetStartingPrice) return `₹${serviceInfo.bridalSetStartingPrice}`;
    return "Contact for Pricing";
  };

  const formatJewelleryCustomization = () => {
    return serviceInfo.customizationAvailable === 'Yes' ? 'Available' : 'Not Available';
  };

  const formatJewelleryRental = () => {
    return serviceInfo.rentalOption === 'Yes' ? 'Available' : 'Not Available';
  };

  const formatGroomWearPricing = () => {
    if (serviceInfo.minPrice && serviceInfo.maxPrice) return `₹${serviceInfo.minPrice} - ₹${serviceInfo.maxPrice}`;
    if (serviceInfo.startingPrice) return `Starting ₹${serviceInfo.startingPrice}`;
    return "Contact for Pricing";
  };

  const formatGroomOrderType = () => {
    if (serviceInfo.orderTypes && serviceInfo.orderTypes.length > 0) {
      return serviceInfo.orderTypes.join(', ');
    }
    return null;
  };

  const formatGroomShipping = () => {
    return serviceInfo.shippingAvailable === 'Yes' ? 'Available' : 'Not Available';
  };

  const formatGroomCustomization = () => {
    const parts = [];
    if (serviceInfo.customizationAvailable === 'Yes') parts.push('Customization Available');
    if (serviceInfo.leadTimeDays) parts.push(`${serviceInfo.leadTimeDays} days lead time`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatBridalKnownFor = () => {
    if (serviceInfo.knownFor && serviceInfo.knownFor.length > 0) {
      return formatCuisines(serviceInfo.knownFor, 'bridal-known-for');
    }
    return null;
  };

  const formatBridalOrderType = () => {
    if (serviceInfo.orderTypes && serviceInfo.orderTypes.length > 0) {
      return serviceInfo.orderTypes.join(', ');
    }
    return null;
  };

  const formatBridalCustomization = () => {
    const parts = [];
    if (serviceInfo.customizationAvailable === 'Yes') parts.push('Available');
    if (serviceInfo.productionTimeDays) parts.push(`${serviceInfo.productionTimeDays} days`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatBridalShipping = () => {
    return serviceInfo.shippingAvailable === 'Yes' ? 'Available' : 'Not Available';
  };

  const formatBridalStoreType = () => {
    const parts = [];
    if (serviceInfo.storeType) parts.push(serviceInfo.storeType);
    if (serviceInfo.establishedYear) parts.push(`Est. ${serviceInfo.establishedYear}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatBridalOutfitAvailability = () => {
    return serviceInfo.outfitAvailability || null;
  };

  const formatAstrologyPricing = () => {
    if (serviceInfo.consultationCharge) return `₹${serviceInfo.consultationCharge}`;
    return "Contact for Pricing";
  };

  const formatAstrologyExperience = () => {
    if (serviceInfo.experienceYears) return `${serviceInfo.experienceYears} Years Experience`;
    return null;
  };

  const formatAstrologyConsultation = () => {
    const parts = [];
    if (serviceInfo.consultationMode) parts.push(serviceInfo.consultationMode);
    if (serviceInfo.sessionDuration) parts.push(`${serviceInfo.sessionDuration} mins`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatAstrologyReports = () => {
    const parts = [];
    if (serviceInfo.reportsProvided === 'Yes') parts.push('Reports Provided');
    if (serviceInfo.remediesOffered === 'Yes') parts.push('Remedies Offered');
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatAstrologyLanguages = () => {
    const parts = [];
    if (serviceInfo.languages && serviceInfo.languages.length > 0) {
      parts.push(`Languages: ${serviceInfo.languages.join(', ')}`);
    }
    if (serviceInfo.travelAvailable === 'Yes') parts.push('Travel Available');
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatAstrologyBooking = () => {
    const parts = [];
    if (serviceInfo.advanceBookingDays) parts.push(`Book ${serviceInfo.advanceBookingDays} days ahead`);
    if (serviceInfo.cancellationPolicy) parts.push(`Cancel: ${serviceInfo.cancellationPolicy}`);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  const formatAstrologyRecognition = () => {
    const parts = [];
    if (serviceInfo.recognition) parts.push(serviceInfo.recognition);
    if (serviceInfo.approach) parts.push(serviceInfo.approach);
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  // Get current category config
  const currentConfig = categoryConfig[category as keyof typeof categoryConfig];
  
  if (!currentConfig) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Service information not available for this category yet.</Text>
      </View>
    );
  }

  return (
    <View>
      {currentConfig?.sections?.map((section: any) => {
        const content = section?.render();
        if (!content) return null;

        return (
          <View key={section.key} style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Image
                source={section.icon}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.infoTitle}>{section.title}</Text>
              <View style={styles.valueContainer}>
                {typeof content === 'string' ? (
                  <Text style={styles.infoValue}>{content}</Text>
                ) : (
                  content
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
 
  infoCard: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f4f3ec',
    alignItems: 'flex-start',
    marginBottom: 8,
    borderRadius: 8,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    width: 48,
    height: 48,
  },
  icon: {
    width: 36,
    height: 36,
  },
  contentContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: FontFamily.semibold,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#666',
    lineHeight: 20,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  expandText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    color: '#FF0762',
  },
  noDataContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: '#666',
    textAlign: 'center',
  },
});

export default ServiceInfoDisplay;