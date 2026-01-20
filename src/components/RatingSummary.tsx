import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const RatingSummary = () => {
  const loadingRatings = false;

  type RatingDistribution = {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };

  const ratingSummary: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution;
  } = {
    averageRating: 4.3,
    totalReviews: 128,
    ratingDistribution: {
      '5': 80,
      '4': 30,
      '3': 10,
      '2': 5,
      '1': 3,
    },
  };

  const latestReviewDate = '2024-12-15';

  const formatDateWithOrdinal = (date: string) => {
    const d = new Date(date);
    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th';

    return `${day}${suffix} ${d.toLocaleString('default', {
      month: 'short',
    })} ${d.getFullYear()}`;
  };

  const averageRating = ratingSummary.averageRating;
  const totalReviews = ratingSummary.totalReviews;

  return (
    <View>
        
      <View style={styles.topRow}>

        <View style={{  paddingRight: 16, width: '45%' }}>
            <View style={styles.leftBlock}>
                <Text style={styles.ratingValue}>
                    {loadingRatings ? '...' : averageRating.toFixed(1)}
                </Text>
                <Text style={styles.ratingOutOf}>/5</Text>
            </View>

            <View style={styles.rightBlock}>
            <View style={styles.starRow}>
                {Array.from({ length: 5 }).map((_, index) => (
                <MaterialIcons
                    key={index}
                    name="star"
                    size={22}
                    color={index < Math.round(averageRating) ? '#FFB800' : '#E5E5E5'}
                />
                ))}
            </View>

            <Text style={styles.reviewText}>
                {totalReviews} Ratings & Reviews
            </Text>
            </View>

            <Text style={styles.updatedText}>
                Last review updated on {formatDateWithOrdinal(latestReviewDate)}
            </Text> 
        </View>

        <View style={{ width: '55%', paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: '#E5E5E5' }}>
            <Text style={styles.summaryLine}>
                <Text style={styles.summaryCount}>{totalReviews}</Text> Ratings & Reviews
            </Text>

            {/* Distribution */}
            <View style={styles.distributionContainer}>
                {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingSummary.ratingDistribution[String(stars) as keyof RatingDistribution] || 0;
                const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                    <View key={stars} style={styles.distributionRow}>
                        <Text style={styles.starLabel}>{stars} ★</Text>

                        <View style={styles.progressBg}>
                            <View
                            style={[styles.progressFill, { width: `${percentage}%` }]}
                            />
                        </View>

                        <Text style={styles.reviewCount}>
                            {count} Review{count !== 1 ? 's' : ''}
                        </Text>
                    </View>
                );
                })}
            </View>

        </View>
      </View>
    </View>
  );
};

export default RatingSummary;




const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0762',
  },
  ratingOutOf: {
    fontSize: 16,
    color: '#A8A8A8',
    paddingBottom: 4,
    marginLeft: 4,
  },
  rightBlock: {
    justifyContent: 'center',
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingTop: 4,
  },
  star: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  reviewText: {
    fontSize: 12,
    color: '#606060',
    fontWeight: '600',
  },
  summaryLine: {
    fontSize: 12,
    color: '#282828',
    marginTop: 4,
  },
  summaryCount: {
    fontWeight: '600',
  },
  distributionContainer: {
    marginTop: 15,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starLabel: {
    width: 30,
    fontSize: 10,
    color: '#4A4A4A',
  },
  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 7,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF0762',
    borderRadius: 4,
  },
  reviewCount: {
    width: 70,
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
  },
  loadingText: {
    textAlign: 'center',
    paddingVertical: 16,
    color: '#6B7280',
  },
  updatedText: {
    marginTop: 12,
    fontSize: 11,
    color: '#9CA3AF',
  },
});
