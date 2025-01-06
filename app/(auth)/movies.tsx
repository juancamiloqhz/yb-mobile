import React from "react"
import { FlatList, RefreshControl, View } from "react-native"
import { useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"

import { fetchMovies, Movie, MovieDetails } from "@/lib/api"
import { useRefreshByUser } from "@/hooks/use-refresh-by-user"
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"

export default function MoviesScreen() {
  const { isPending, error, data, refetch } = useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  })
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch)
  useRefreshOnFocus(refetch)

  const renderItem = React.useCallback(({ item }: { item: Movie }) => {
    return <ListItem item={item} />
  }, [])

  // if (isPending) return <LoadingIndicator />
  if (isPending) return <Text>Loading...</Text>

  // if (error) return <ErrorMessage message={error.message}></ErrorMessage>
  if (error) return <Text>Error</Text>
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.title}
      ItemSeparatorComponent={() => <Separator className="my-4" />}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingByUser}
          onRefresh={refetchByUser}
        />
      }
    ></FlatList>
  )
}

type Props = {
  item: Movie
}

function ListItem({ item }: Props) {
  return (
    // <TouchableRipple onPress={() => onPress(item)} accessibilityRole="button">
    //   <View style={styles.item}>
    //     <View style={styles.firstRow}>
    //       <Paragraph style={styles.title}>{item.title}</Paragraph>
    //     </View>
    //     <View style={styles.secondRow}>
    //       <Paragraph>{item.year}</Paragraph>
    //     </View>
    //   </View>
    // </TouchableRipple>
    <Link href={`/`} accessibilityRole="button">
      <View className="mb-3 pb-3 pl-8 pr-3 pt-3">
        <View className="my-1">
          <Text className="text-lg font-bold">{item.title}</Text>
        </View>
        <View className="mb-1">
          <Text className="text-muted-foreground">{item.year}</Text>
        </View>
      </View>
    </Link>
  )
}