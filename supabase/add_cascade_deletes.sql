-- Run this ONCE in Supabase SQL Editor.
-- Adds ON DELETE CASCADE so deleting from auth.users cleans ALL user data.

DO $$ BEGIN
  CREATE OR REPLACE FUNCTION drop_fk_if_exists(tbl text, col text) RETURNS void AS $$
  DECLARE con_name text;
  BEGIN
    SELECT constraint_name INTO con_name FROM information_schema.key_column_usage
      WHERE table_name = tbl AND column_name = col LIMIT 1;
    IF con_name IS NOT NULL THEN EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', tbl, con_name); END IF;
  END;
  $$ LANGUAGE plpgsql;
EXCEPTION WHEN duplicate_function THEN NULL;
END $$;

-- Direct user_id tables
DO $$ BEGIN PERFORM drop_fk_if_exists('user_journey', 'user_id'); END $$;
ALTER TABLE user_journey ADD CONSTRAINT fk_uj_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('daily_tasks', 'user_id'); END $$;
ALTER TABLE daily_tasks ADD CONSTRAINT fk_dt_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('daily_checkins', 'user_id'); END $$;
ALTER TABLE daily_checkins ADD CONSTRAINT fk_dc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('weight_logs', 'user_id'); END $$;
ALTER TABLE weight_logs ADD CONSTRAINT fk_wl_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('food_logs', 'user_id'); END $$;
ALTER TABLE food_logs ADD CONSTRAINT fk_fl_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('fasting_sessions', 'user_id'); END $$;
ALTER TABLE fasting_sessions ADD CONSTRAINT fk_fs_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('onboarding_data', 'user_id'); END $$;
ALTER TABLE onboarding_data ADD CONSTRAINT fk_od_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('xp_transactions', 'user_id'); END $$;
ALTER TABLE xp_transactions ADD CONSTRAINT fk_xt_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('achievements', 'user_id'); END $$;
ALTER TABLE achievements ADD CONSTRAINT fk_ach_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('meal_completions', 'user_id'); END $$;
ALTER TABLE meal_completions ADD CONSTRAINT fk_mc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('meal_swaps', 'user_id'); END $$;
ALTER TABLE meal_swaps ADD CONSTRAINT fk_ms_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('notifications', 'user_id'); END $$;
ALTER TABLE notifications ADD CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('notification_preferences', 'user_id'); END $$;
ALTER TABLE notification_preferences ADD CONSTRAINT fk_np_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('push_subscriptions', 'user_id'); END $$;
ALTER TABLE push_subscriptions ADD CONSTRAINT fk_ps_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('water_intake', 'user_id'); END $$;
ALTER TABLE water_intake ADD CONSTRAINT fk_wi_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('macro_goals', 'user_id'); END $$;
ALTER TABLE macro_goals ADD CONSTRAINT fk_mg_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('weekly_reports', 'user_id'); END $$;
ALTER TABLE weekly_reports ADD CONSTRAINT fk_wr_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('body_measurements', 'user_id'); END $$;
ALTER TABLE body_measurements ADD CONSTRAINT fk_bm_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('progress_photos', 'user_id'); END $$;
ALTER TABLE progress_photos ADD CONSTRAINT fk_pp_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('ketone_logs', 'user_id'); END $$;
ALTER TABLE ketone_logs ADD CONSTRAINT fk_kl_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('chat_messages', 'user_id'); END $$;
ALTER TABLE chat_messages ADD CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('daily_reflections', 'user_id'); END $$;
ALTER TABLE daily_reflections ADD CONSTRAINT fk_dr_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('daily_progress', 'user_id'); END $$;
ALTER TABLE daily_progress ADD CONSTRAINT fk_dp_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('habits', 'user_id'); END $$;
ALTER TABLE habits ADD CONSTRAINT fk_hab_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('habit_completions', 'user_id'); END $$;
ALTER TABLE habit_completions ADD CONSTRAINT fk_hc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('recipe_favorites', 'user_id'); END $$;
ALTER TABLE recipe_favorites ADD CONSTRAINT fk_rf_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('recipe_collections', 'user_id'); END $$;
ALTER TABLE recipe_collections ADD CONSTRAINT fk_rc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('user_meal_plan', 'user_id'); END $$;
ALTER TABLE user_meal_plan ADD CONSTRAINT fk_ump_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('step_logs', 'user_id'); END $$;
ALTER TABLE step_logs ADD CONSTRAINT fk_sl_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('shopping_checks', 'user_id'); END $$;
ALTER TABLE shopping_checks ADD CONSTRAINT fk_sc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('custom_shopping_items', 'user_id'); END $$;
ALTER TABLE custom_shopping_items ADD CONSTRAINT fk_csi_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('meal_prep_plans', 'user_id'); END $$;
ALTER TABLE meal_prep_plans ADD CONSTRAINT fk_mpp_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('referral_codes', 'user_id'); END $$;
ALTER TABLE referral_codes ADD CONSTRAINT fk_refc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('quiz_responses', 'user_id'); END $$;
ALTER TABLE quiz_responses ADD CONSTRAINT fk_qr_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('community_posts', 'user_id'); END $$;
ALTER TABLE community_posts ADD CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('community_comments', 'user_id'); END $$;
ALTER TABLE community_comments ADD CONSTRAINT fk_cc_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('community_reactions', 'user_id'); END $$;
ALTER TABLE community_reactions ADD CONSTRAINT fk_cr_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Tables with non-standard column names
DO $$ BEGIN PERFORM drop_fk_if_exists('community_reports', 'reporter_id'); END $$;
ALTER TABLE community_reports ADD CONSTRAINT fk_crp_reporter FOREIGN KEY (reporter_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('referrals', 'referrer_id'); END $$;
ALTER TABLE referrals ADD CONSTRAINT fk_ref_referrer FOREIGN KEY (referrer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

DO $$ BEGIN PERFORM drop_fk_if_exists('referrals', 'referred_user_id'); END $$;
ALTER TABLE referrals ADD CONSTRAINT fk_ref_referred FOREIGN KEY (referred_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Chain: recipe_collection_items → recipe_collections (which cascades to auth.users)
DO $$ BEGIN PERFORM drop_fk_if_exists('recipe_collection_items', 'collection_id'); END $$;
ALTER TABLE recipe_collection_items ADD CONSTRAINT fk_rci_collection FOREIGN KEY (collection_id) REFERENCES recipe_collections(id) ON DELETE CASCADE;

DROP FUNCTION IF EXISTS drop_fk_if_exists;
